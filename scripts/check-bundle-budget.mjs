#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const root = process.cwd();
const distAssets = path.join(root, 'dist', 'assets');

const budgets = {
  cssRawMax: Number(process.env.BUDGET_CSS_RAW_MAX ?? 195000),
  cssGzipMax: Number(process.env.BUDGET_CSS_GZIP_MAX ?? 34000),
  indexJsRawMax: Number(process.env.BUDGET_INDEX_JS_RAW_MAX ?? 130000),
  indexJsGzipMax: Number(process.env.BUDGET_INDEX_JS_GZIP_MAX ?? 45000),
  threeRawMax: Number(process.env.BUDGET_THREE_RAW_MAX ?? 950000),
  threeGzipMax: Number(process.env.BUDGET_THREE_GZIP_MAX ?? 240000),
};

if (!fs.existsSync(distAssets)) {
  console.error('dist/assets not found. Run `npm run build` first.');
  process.exit(1);
}

const assetNames = fs.readdirSync(distAssets);
const cssFiles = assetNames.filter((name) => name.endsWith('.css'));
const jsFiles = assetNames.filter((name) => name.endsWith('.js'));
const indexJsFile = jsFiles.find((name) => /^index-.*\.js$/.test(name));
const threeJsFile = jsFiles.find((name) => /^vendor-three-.*\.js$/.test(name));

if (cssFiles.length === 0 || !indexJsFile || !threeJsFile) {
  console.error('Missing CSS assets, index JS asset, or vendor-three chunk in dist/assets.');
  process.exit(1);
}

const measure = (filePath) => {
  const content = fs.readFileSync(filePath);
  const raw = content.length;
  const gzip = zlib.gzipSync(content, { level: 9 }).length;
  return { raw, gzip };
};

const cssMetrics = cssFiles
  .map((name) => measure(path.join(distAssets, name)))
  .reduce(
    (acc, item) => ({
      raw: acc.raw + item.raw,
      gzip: acc.gzip + item.gzip,
    }),
    { raw: 0, gzip: 0 },
  );

const indexMetrics = measure(path.join(distAssets, indexJsFile));
const threeMetrics = measure(path.join(distAssets, threeJsFile));

const violations = [];
if (cssMetrics.raw > budgets.cssRawMax) {
  violations.push(`CSS raw ${cssMetrics.raw} > ${budgets.cssRawMax}`);
}
if (cssMetrics.gzip > budgets.cssGzipMax) {
  violations.push(`CSS gzip ${cssMetrics.gzip} > ${budgets.cssGzipMax}`);
}
if (indexMetrics.raw > budgets.indexJsRawMax) {
  violations.push(`index JS raw ${indexMetrics.raw} > ${budgets.indexJsRawMax}`);
}
if (indexMetrics.gzip > budgets.indexJsGzipMax) {
  violations.push(`index JS gzip ${indexMetrics.gzip} > ${budgets.indexJsGzipMax}`);
}
if (threeMetrics.raw > budgets.threeRawMax) {
  violations.push(`vendor-three raw ${threeMetrics.raw} > ${budgets.threeRawMax}`);
}
if (threeMetrics.gzip > budgets.threeGzipMax) {
  violations.push(`vendor-three gzip ${threeMetrics.gzip} > ${budgets.threeGzipMax}`);
}

console.log(
  JSON.stringify(
    {
      css: cssMetrics,
      indexJs: {
        file: indexJsFile,
        ...indexMetrics,
      },
      vendorThree: {
        file: threeJsFile,
        ...threeMetrics,
      },
      budgets,
    },
    null,
    2,
  ),
);

if (violations.length > 0) {
  console.error('\nBundle budget violations:');
  violations.forEach((item) => console.error(`- ${item}`));
  process.exit(1);
}

console.log('\nBundle budget checks passed.');
