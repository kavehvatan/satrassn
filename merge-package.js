// Adds devDependencies tailwindcss/postcss/autoprefixer if missing.
const fs = require('fs'); const path = require('path');
const pkgPath = path.join(process.cwd(), 'package.json');
if (!fs.existsSync(pkgPath)) { console.error('package.json not found'); process.exit(1); }
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
pkg.devDependencies = pkg.devDependencies || {};
const want = { tailwindcss: '^3.4.13', postcss: '^8.4.41', autoprefixer: '^10.4.20' };
let changed = false;
for (const [k,v] of Object.entries(want)) { if (!pkg.devDependencies[k]) { pkg.devDependencies[k]=v; changed=true; } }
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
console.log(changed ? 'package.json updated' : 'package.json already OK');
