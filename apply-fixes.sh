#!/usr/bin/env bash
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cp -f "$SCRIPT_DIR/postcss.config.js" ./postcss.config.js
cp -f "$SCRIPT_DIR/tailwind.config.js" ./tailwind.config.js
mkdir -p ./lib && cp -f "$SCRIPT_DIR/lib/withCsrf.js" ./lib/withCsrf.js
node "$SCRIPT_DIR/merge-package.js"
npm install
shopt -s nullglob
for f in pages/api/*.js; do
  sed -i.bak "s#from '@/lib/withCsrf'#from '../../lib/withCsrf'#g" "$f" || true
  sed -i.bak "s/function handler handler\(/function handler(/g" "$f" || true
done
echo "Fixes applied."
