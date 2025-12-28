import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { findUserByEmail } from "./user.service.js";
import { JWT_SECRET } from "../config/configEnv.js";

export async function loginUser(email, password) {
  const user = await findUserByEmail(email);
  if (!user) {
    throw new Error("Credenciales incorrectas");
  }

<<<<<<< HEAD
  // bcrypt.compare es async
  const matched = await bcrypt.compare(password, user.password);
  if (!matched) throw new Error("Credenciales incorrectas");
  const payload = { sub: user.id, email: user.email, rol: user.rol };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1h' });
=======
  const isMatch = await bcrypt.compare(password, user.password);
  
  if (!isMatch) {
    throw new Error("Credenciales incorrectas");
  }

  const payload = { 
    id: user.id,
    nombre: user.nombre,
    email: user.email,
    rol: user.rol
  };

  const token = jwt.sign(payload, JWT_SECRET, { 
    expiresIn: "8h"
  });
>>>>>>> main

  delete user.password;
  return { user, token };
}
