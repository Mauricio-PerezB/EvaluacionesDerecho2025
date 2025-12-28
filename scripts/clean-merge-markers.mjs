import fs from 'fs';
import path from 'path';

function collectJS(dir){
  return fs.readdirSync(dir, {withFileTypes:true}).flatMap(e=>{
    const full=path.join(dir,e.name);
    if(e.isDirectory()) return collectJS(full);
    if(e.isFile() && full.endsWith('.js')) return [full];
    return [];
  });
}

const files = collectJS(path.resolve(process.cwd(),'src'));
for(const f of files){
  let s = fs.readFileSync(f,'utf8');
  const original = s;
  s = s.split(/\r?\n/).filter(line=>{
    return !/^<{7}/.test(line) && !/^={7}/.test(line) && !/^>{7}/.test(line);
  }).join('\n');
  if(s!==original){
    fs.writeFileSync(f,s,'utf8');
    console.log('Cleaned', path.relative(process.cwd(),f));
  }
}
console.log('Done');
