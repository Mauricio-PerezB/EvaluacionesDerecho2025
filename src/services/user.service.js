import { AppDataSource } from "../config/configDB.js";
import { User } from "../entities/user.entity.js";
import bcrypt from "bcrypt";

const userRepository = AppDataSource.getRepository(User);

export async function createUser(data) {
  const hashedPassword = await bcrypt.hash(data.password, 10);

  const newUser = userRepository.create({
    email: data.email,
    password: hashedPassword,
  });

  return await userRepository.save(newUser);
}

export async function findUserByEmail(email) {
  return await userRepository.findOneBy({ email });
}

export async function findUserById(id) {
  return await userRepository.findOneBy({ id });
}

export async function updateProfile(userId, changes) {
  const user = await findUserById(userId);
  if (!user) throw new Error("Usuario no encontrado");

  // No permitir que se cambie el email directamente aquí (opcional)
  if (changes.email && changes.email !== user.email) {
    // podría agregarse lógica para verificar unicidad; por ahora lanzamos error
    throw new Error("No está permitido cambiar el email desde este endpoint");
  }

  // Si se envía password, hashearla
  if (changes.password) {
    const hashed = await bcrypt.hash(changes.password, 10);
    changes.password = hashed;
  }

  // Mezclar cambios en la entidad y guardar
  userRepository.merge(user, changes);
  return await userRepository.save(user);
}

export async function deleteProfile(userId) {
  const user = await findUserById(userId);
  if (!user) throw new Error("Usuario no encontrado");

  await userRepository.delete({ id: userId });
  return { id: userId };
}
