(async ()=>{
  try {
    await import('./src/routes/index.routes.js');
    console.log('Routes imported successfully');
  } catch (e) {
    console.error(String(e.stack || e));
    process.exit(1);
  }
})();