import { AppDataSource } from "../config/configDb.js";
<<<<<<< HEAD
import { User } from "../entities/user.entity.js";
=======
import { UsuarioSchema } from "../entities/usuario.entity.js";
>>>>>>> main
import bcrypt from "bcrypt";

const userRepository = AppDataSource.getRepository(UsuarioSchema);

<<<<<<< HEAD
export async function createUser(data) {  
  const hashedPassword = await bcrypt.hash(data.password, 10);
=======
export async function createUser(data) {
  const { nombre, apellido, rut, email, password, rol } = data;

  const emailExists = await userRepository.findOneBy({ email });
  if (emailExists) {
    throw new Error("El email ya está registrado");
  }
  const rutExists = await userRepository.findOneBy({ rut });
  if (rutExists) {
    throw new Error("El RUT ya está registrado");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
>>>>>>> main

  const newUser = userRepository.create({
    nombre,
    apellido,
    rut,
    email,
    password: hashedPassword,
<<<<<<< HEAD
    rol: data.rol || 'ALUMNO'
=======
    rol: rol || 'ALUMNO'
>>>>>>> main
  });

  return await userRepository.save(newUser);
}

export async function findUserByEmail(email) {
  return await userRepository
    .createQueryBuilder("usuario")
    .where("usuario.email = :email", { email: email })
    .addSelect("usuario.password")
    .getOne();
}

export async function findUserById(id) {
  return await userRepository.findOneBy({ id });
}

export async function updateProfile(userId, changes) {
  const user = await findUserById(userId);
  if (!user) throw new Error("Usuario no encontrado");

  if (changes.email && changes.email !== user.email) {
    throw new Error("No está permitido cambiar el email desde este endpoint");
  }

  if (changes.password) {
    const hashed = await bcrypt.hash(changes.password, 10);
    changes.password = hashed;
  }

  userRepository.merge(user, changes);
  return await userRepository.save(user);
}

export async function deleteProfile(userId) {
  const user = await findUserById(userId);
  if (!user) throw new Error("Usuario no encontrado");

  await userRepository.delete({ id: userId });
  return { id: userId };
}