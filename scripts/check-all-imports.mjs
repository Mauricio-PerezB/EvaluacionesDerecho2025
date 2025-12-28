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

(async ()=>{
  const src = path.resolve(process.cwd(), 'src');
  const files = collectFiles(src);
  for (const f of files) {
    const rel = path.relative(process.cwd(), f).replace(/\\/g, '/');
    try {
      await import('../' + rel);
      console.log('OK', rel);
    } catch (e) {
      console.error('ERROR importing', rel);
      console.error(String(e.stack || e));
      process.exit(1);
    }
  }
  console.log('All imports OK');
})();
