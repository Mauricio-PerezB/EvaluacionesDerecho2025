(async ()=>{
  const modules = [
    '../src/services/auth.service.js',
    '../src/services/user.service.js',
    '../src/Handlers/responseHandlers.js'
  ];
  for (const m of modules) {
    try {
      await import(m);
      console.log('Imported', m);
    } catch (e) {
      console.error('Error importing', m);
      console.error(String(e.stack || e));
    }
  }
})();
