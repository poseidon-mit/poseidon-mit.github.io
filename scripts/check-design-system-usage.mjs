#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import ts from 'typescript';
import {
  ACTIVE_PAGES,
  COMPONENT_REGISTRY,
  ENGINE_COLOR_LITERAL_ALLOWED_FILES,
  FORBIDDEN_ENGINE_COLOR_LITERALS,
  SHELL_EXEMPT_PAGES,
  STYLE_EXCEPTION_FILES,
} from './design-system-config.mjs';

const ROOT = process.cwd();
const SRC_ROOT = path.join(ROOT, 'src');
const PAGES_ROOT = path.join(SRC_ROOT, 'pages');
const STRICT = process.argv.includes('--strict');

function isFile(target) {
  try {
    return fs.statSync(target).isFile();
  } catch {
    return false;
  }
}

function readSource(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function toPosix(p) {
  return p.split(path.sep).join('/');
}

function toRelative(filePath) {
  return toPosix(path.relative(ROOT, filePath));
}

function resolveLocalImport(fromFile, specifier) {
  let base;

  if (specifier.startsWith('@/')) {
    // Resolve @/ alias → src/
    base = path.resolve(SRC_ROOT, specifier.slice(2));
  } else if (specifier.startsWith('./') || specifier.startsWith('../')) {
    base = path.resolve(path.dirname(fromFile), specifier);
  } else {
    return null;
  }

  const candidates = [
    base,
    `${base}.ts`,
    `${base}.tsx`,
    `${base}.js`,
    `${base}.jsx`,
    path.join(base, 'index.ts'),
    path.join(base, 'index.tsx'),
    path.join(base, 'index.js'),
    path.join(base, 'index.jsx'),
  ];

  for (const candidate of candidates) {
    if (isFile(candidate)) {
      return candidate;
    }
  }

  return null;
}

function parseImports(filePath) {
  const sourceText = readSource(filePath);
  const sourceFile = ts.createSourceFile(filePath, sourceText, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const imports = [];

  sourceFile.forEachChild((node) => {
    if (!ts.isImportDeclaration(node)) {
      return;
    }

    const importClause = node.importClause;
    if (!importClause || importClause.isTypeOnly) {
      return;
    }

    const moduleSpecifierNode = node.moduleSpecifier;
    if (!ts.isStringLiteral(moduleSpecifierNode)) {
      return;
    }

    const moduleSpecifier = moduleSpecifierNode.text;
    const resolved = resolveLocalImport(filePath, moduleSpecifier);

    if (!resolved) {
      return;
    }

    const importedNames = [];

    if (importClause.name) {
      importedNames.push(importClause.name.text);
    }

    if (importClause.namedBindings) {
      if (ts.isNamedImports(importClause.namedBindings)) {
        for (const el of importClause.namedBindings.elements) {
          if (!el.isTypeOnly) {
            importedNames.push((el.propertyName ?? el.name).text);
          }
        }
      } else if (ts.isNamespaceImport(importClause.namedBindings)) {
        importedNames.push(importClause.namedBindings.name.text);
      }
    }

    imports.push({
      moduleSpecifier,
      resolved,
      importedNames,
    });
  });

  return imports;
}

function componentNameFromResolvedPath(resolvedPath) {
  let componentName = path.basename(resolvedPath, path.extname(resolvedPath));
  if (componentName === 'index') {
    componentName = path.basename(path.dirname(resolvedPath));
  }
  return componentName;
}

function getEntryFiles() {
  const pageFiles = fs
    .readdirSync(PAGES_ROOT)
    .filter((name) => name.endsWith('.tsx') && !name.includes('__tests__'))
    .map((name) => path.join(PAGES_ROOT, name));

  return [
    path.join(SRC_ROOT, 'main.tsx'),
    path.join(SRC_ROOT, 'App.tsx'),
    ...pageFiles,
  ];
}

function buildReachableGraph() {
  const reachable = new Set();
  const stack = getEntryFiles().filter(isFile);

  while (stack.length > 0) {
    const current = stack.pop();
    if (!current || reachable.has(current)) {
      continue;
    }

    reachable.add(current);

    const imports = parseImports(current);
    for (const item of imports) {
      if (item.resolved.startsWith(SRC_ROOT)) {
        stack.push(item.resolved);
      }
    }
  }

  return reachable;
}

const reachable = buildReachableGraph();
const errors = [];
const warnings = [];

const componentFiles = [...reachable].filter((filePath) => toRelative(filePath).startsWith('src/components/'));
const pageFiles = [...reachable].filter((filePath) => toRelative(filePath).startsWith('src/pages/'));
const appFiles = [...reachable].filter((filePath) => toRelative(filePath) === 'src/App.tsx');
const surfaceFiles = [...pageFiles, ...componentFiles, ...appFiles];
const BANNED_GLASS_PATTERNS = [
  {
    name: 'surface-glass-class',
    pattern: /\bsurface-glass\b/,
    message: 'surface-glass is deprecated. Use <Surface variant=\"glass\">.',
  },
  {
    name: 'legacy-glass-class',
    pattern: /(?:className|class)\s*=\s*["'`][^"'`]*\bglass-surface(?:-card)?\b/,
    message: 'Do not use legacy glass-surface classes. Use <Surface variant=\"glass\">.',
  },
  {
    name: 'raw-glass-card-class',
    pattern: /rounded-2xl\s+border\s+border-white\/\[0\.08\]\s+bg-white\/\[0\.03\]/,
    message: 'Raw glass card class is forbidden. Use <Surface variant=\"glass\">.',
  },
  {
    name: 'inline-nav-rgba',
    pattern: /rgba\(11,18,33,0\.(?:8|95)\)/,
    message: 'Inline nav rgba background is forbidden. Use glass-header class.',
  },
  {
    name: 'legacy-glasscard-component',
    pattern: /<\s*GlassCard\b|import\s*\{[^}]*\bGlassCard\b[^}]*\}\s*from/,
    message: 'GlassCard is deprecated. Use <Surface variant=\"glass\">.',
  },
];

for (const filePath of surfaceFiles) {
  const relativePath = toRelative(filePath);
  const source = readSource(filePath);
  const pageName = relativePath.startsWith('src/pages/')
    ? path.basename(relativePath, '.tsx')
    : null;
  const isActivePage = pageName ? ACTIVE_PAGES.has(pageName) : false;

  const styleCount = (source.match(/style=\{\{/g) || []).length;
  if (styleCount > 0 && !isActivePage && !STYLE_EXCEPTION_FILES.has(relativePath)) {
    errors.push(`[inline-style] ${relativePath} uses style={{}} ${styleCount}x without exception.`);
  }

  if (!isActivePage && !ENGINE_COLOR_LITERAL_ALLOWED_FILES.has(relativePath)) {
    for (const literal of FORBIDDEN_ENGINE_COLOR_LITERALS) {
      if (source.includes(literal)) {
        errors.push(`[engine-color] ${relativePath} contains local engine color literal ${literal}. Use engine-semantic.ts.`);
      }
    }
  }

  for (const rule of BANNED_GLASS_PATTERNS) {
    if (rule.pattern.test(source)) {
      errors.push(`[glass-policy] ${relativePath} violates ${rule.name}. ${rule.message}`);
    }
  }
}

for (const filePath of pageFiles) {
  const pageName = path.basename(filePath, '.tsx');
  if (!ACTIVE_PAGES.has(pageName)) {
    continue;
  }
  // v0-generated self-contained pages are wrapped by AppNavShell via the router;
  // they intentionally do not import PageShell directly.
  if (SHELL_EXEMPT_PAGES.has(pageName)) {
    continue;
  }

  const source = readSource(filePath);
  if (!/CommandCenterShell|EnginePageShell|PageShell/.test(source)) {
    errors.push(`[shell] ${toRelative(filePath)} does not use CommandCenterShell, EnginePageShell, or PageShell.`);
  }
}

for (const filePath of surfaceFiles) {
  const relativePath = toRelative(filePath);
  const imports = parseImports(filePath);

  for (const item of imports) {
    if (item.moduleSpecifier.includes('/components/spectacular/')) {
      errors.push(
        `[forbidden-import] ${relativePath} imports ${item.moduleSpecifier}. Use design-system primitives instead.`,
      );
      continue;
    }

    const resolvedRel = toRelative(item.resolved);
    if (!resolvedRel.startsWith('src/components/')) {
      continue;
    }

    const resolvedExt = path.extname(item.resolved);
    const resolvedBase = path.basename(item.resolved, resolvedExt);
    const isBarrelImport = resolvedBase === 'index';

    // For barrel imports like "@/components/poseidon", validate imported symbol names
    // against the registry instead of directory name "poseidon".
    if (isBarrelImport && item.importedNames.length > 0) {
      for (const importedName of item.importedNames) {
        const entry = COMPONENT_REGISTRY[importedName];
        if (!entry) {
          errors.push(
            `[registry] ${relativePath} imports ${importedName} from ${item.moduleSpecifier} but registry entry is missing.`,
          );
          continue;
        }

        if (entry.status === 'legacy' || entry.status === 'forbidden') {
          errors.push(
            `[registry] ${relativePath} imports ${importedName} (${entry.status}). Replace with ${entry.replacement ?? 'canonical primitive'}.`,
          );
          continue;
        }

        if (STRICT && entry.status === 'compat') {
          errors.push(
            `[registry] ${relativePath} imports ${importedName} (compat). Strict mode requires canonical replacement ${entry.replacement ?? ''}.`,
          );
        }
      }
      continue;
    }

    const componentName = componentNameFromResolvedPath(item.resolved);
    const entry = COMPONENT_REGISTRY[componentName];

    if (!entry) {
      errors.push(`[registry] ${relativePath} imports ${componentName} but registry entry is missing.`);
      continue;
    }

    if (entry.status === 'legacy' || entry.status === 'forbidden') {
      errors.push(
        `[registry] ${relativePath} imports ${componentName} (${entry.status}). Replace with ${entry.replacement ?? 'canonical primitive'}.`,
      );
      continue;
    }

    if (STRICT && entry.status === 'compat') {
      errors.push(
        `[registry] ${relativePath} imports ${componentName} (compat). Strict mode requires canonical replacement ${entry.replacement ?? ''}.`,
      );
    }
  }
}

if (!STRICT) {
  const compatUsed = new Set();

  for (const filePath of surfaceFiles) {
    const imports = parseImports(filePath);
    for (const item of imports) {
      const resolvedRel = toRelative(item.resolved);
      if (!resolvedRel.startsWith('src/components/')) {
        continue;
      }
      const resolvedExt = path.extname(item.resolved);
      const resolvedBase = path.basename(item.resolved, resolvedExt);
      const isBarrelImport = resolvedBase === 'index';

      if (isBarrelImport && item.importedNames.length > 0) {
        for (const importedName of item.importedNames) {
          const entry = COMPONENT_REGISTRY[importedName];
          if (entry?.status === 'compat') {
            compatUsed.add(importedName);
          }
        }
        continue;
      }
      const componentName = componentNameFromResolvedPath(item.resolved);
      const entry = COMPONENT_REGISTRY[componentName];
      if (entry?.status === 'compat') {
        compatUsed.add(componentName);
      }
    }
  }

  if (compatUsed.size > 0) {
    warnings.push(`[compat] ${[...compatUsed].sort().join(', ')}`);
  }
}

console.log(`[design-system] reachable files: ${reachable.size}`);
console.log(`[design-system] reachable pages: ${pageFiles.length}`);
console.log(`[design-system] reachable components: ${componentFiles.length}`);

if (warnings.length > 0) {
  console.log('[design-system] warnings:');
  for (const warning of warnings) {
    console.log(`  - ${warning}`);
  }
}

if (errors.length > 0) {
  console.error('[design-system] violations:');
  for (const error of errors) {
    console.error(`  - ${error}`);
  }
  process.exit(1);
}

console.log('[design-system] usage checks passed.');
