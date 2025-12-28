(async ()=>{
  const modules = [
    '../src/routes/auth.routes.js',
    '../src/routes/profile.routes.js',
    '../src/routes/pregunta.routes.js',
    '../src/routes/horario.routes.js',
    '../src/routes/index.routes.js'
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