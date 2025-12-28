import { AppDataSource } from "../config/configDb.js";
import { UsuarioSchema } from "../entities/usuario.entity.js";
import bcrypt from "bcrypt";

function getUserRepository() {
  if (!AppDataSource || !AppDataSource.isInitialized) {
    throw new Error("Base de datos no inicializada");
  }
  return AppDataSource.getRepository(UsuarioSchema);
}

export async function createUser(data) {
  const { nombre, apellido, rut, email, password, rol } = data;

  const userRepository = getUserRepository();

  const emailExists = await userRepository.findOneBy({ email });
  if (emailExists) {
    throw new Error("El email ya está registrado");
  }
  const rutExists = await userRepository.findOneBy({ rut });
  if (rutExists) {
    throw new Error("El RUT ya está registrado");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = userRepository.create({
    nombre,
    apellido,
    rut,
    email,
    password: hashedPassword,
    rol: rol || "ALUMNO",
  });

  return await userRepository.save(newUser);
}

export async function findUserByEmail(email) {
  const userRepository = getUserRepository();
  return await userRepository
    .createQueryBuilder("usuario")
    .where("usuario.email = :email", { email: email })
    .addSelect("usuario.password")
    .getOne();
}

export async function findUserById(id) {
  const userRepository = getUserRepository();
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
  const userRepository = getUserRepository();
  userRepository.merge(user, changes);
  return await userRepository.save(user);
}

export async function deleteProfile(userId) {
  const user = await findUserById(userId);
  if (!user) throw new Error("Usuario no encontrado");
  const userRepository = getUserRepository();
  await userRepository.delete({ id: userId });
  return { id: userId };
}