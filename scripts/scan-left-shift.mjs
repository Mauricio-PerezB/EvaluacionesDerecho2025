import fs from 'fs';
import path from 'path';

function collectFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let files = [];
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) files = files.concat(collectFiles(full));
    else if (e.isFile() && full.endsWith('.js')) files.push(full);
  }
  return files;
}

const src = path.resolve(process.cwd(), 'src');
const files = collectFiles(src);
let found = false;
for (const f of files) {
  const content = fs.readFileSync(f, 'utf8');
  if (content.includes('<<')) {
    console.log('FOUND << in', path.relative(process.cwd(), f));
    // show surrounding context
    const idx = content.indexOf('<<');
    console.log(content.slice(Math.max(0, idx-40), idx+40));
    found = true;
  }
}
if (!found) console.log('No << found in src JS files.');
