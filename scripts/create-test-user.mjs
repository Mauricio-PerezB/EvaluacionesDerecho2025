import { createUser } from '../src/services/user.service.js';

(async ()=>{
  try{
    const u = await createUser({
      nombre:'Juan', apellido:'Perez', rut:'12343678-9', email:'juanprofesor@example.com', password:'MiPassSeguro123', rol:'PROFESOR'
    });
    console.log('Created user id:', u.id, 'rol:', u.rol);
    process.exit(0);
  }catch(e){
    console.error('Error:', e.message);
    process.exit(1);
  }
})();
