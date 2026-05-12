import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const htmlFiles = [];

function walk(dir) {
  for (const item of readdirSync(dir)) {
    if (["node_modules", ".git", "temporary screenshots"].includes(item)) continue;
    const path = join(dir, item);
    const stat = statSync(path);
    if (stat.isDirectory()) walk(path);
    if (stat.isFile() && path.endsWith(".html")) htmlFiles.push(path);
  }
}

walk(root);

const issues = [];
for (const file of htmlFiles) {
  const html = readFileSync(file, "utf8");
  if (!/<title>[^<]{20,}<\/title>/.test(html)) issues.push(`${file}: missing useful title`);
  if (!/<meta name="description" content="[^"]{80,}"/.test(html)) issues.push(`${file}: missing useful meta description`);
  if ((html.match(/<h1[\s>]/g) || []).length !== 1) issues.push(`${file}: expected exactly one h1`);
  if (!/rel="canonical"/.test(html) && !file.endsWith("404.html")) issues.push(`${file}: missing canonical`);
}

if (issues.length) {
  console.error(issues.join("\n"));
  process.exit(1);
}

console.log(`Validated ${htmlFiles.length} HTML pages.`);
