import fs from 'fs';
import path from 'path';

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
  });
}

const fixRegexes = [
  { match: /import\s+\{([^}]+)\}\s+from\s+['"]react-router-dom['"];/g, replace: 'import {$1} from "@/router";' },
  { match: /import\s+\{([^}]+)\}\s+from\s+['"]sonner['"];/g, replace: 'import { useToast } from "@/hooks/useToast";' },
  { match: /toast\(/g, replace: 'useToast().showToast({ message: ' },
  { match: /const\s+container\s*=\s*\{/g, replace: 'const container: import("framer-motion").Variants = {' },
  { match: /const\s+item\s*=\s*\{/g, replace: 'const item: import("framer-motion").Variants = {' },
  { match: /import\s+\{\s*Link,\s*useNavigate\s*\}\s+from\s+['"]@\/router['"];/g, replace: 'import { Link, useRouter } from "@/router";' },
  { match: /const\s+navigate\s*=\s*useNavigate\(\);/g, replace: 'const { navigate } = useRouter();' }
];

walk('./src', (filePath) => {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    // Fix react-router-dom
    if(content.includes('react-router-dom')) {
      content = content.replace(/import\s+\{([^}]+)\}\s+from\s+['"]react-router-dom['"];/g, (match, p1) => {
         let newImports = p1.replace('useParams', 'useRouter').replace('useNavigate', 'useRouter');
         return `import { ${newImports} } from "@/router";`;
      });
      content = content.replace(/const\s+\{\s*id\s*\}\s*=\s*useRouter(?:<[^>]+>)?\(\);/g, 'const { search } = useRouter();\n  const id = new URLSearchParams(search).get("id") || "MOCK-ID";');
      content = content.replace(/const\s+navigate\s*=\s*useRouter\(\);/g, 'const { navigate } = useRouter();');
    }

    // Fix sonner
    if(content.includes('sonner')) {
      content = content.replace(/import\s+\{\s*toast\s*\}\s+from\s+['"]sonner['"];/g, 'import { useToast } from "@/hooks/useToast";');
      content = content.replace(/toast\s*\(/g, 'const { showToast } = useToast();\n    showToast({ variant: "info", message: ');
    }
    
    // Fix framer-motion variants
    content = content.replace(/const\s+container\s*=\s*\{/g, 'const container: import("framer-motion").Variants = {');
    content = content.replace(/const\s+item\s*=\s*\{/g, 'const item: import("framer-motion").Variants = {');
    
    if (content !== original) {
      fs.writeFileSync(filePath, content);
      console.log('Fixed', filePath);
    }
  }
});
