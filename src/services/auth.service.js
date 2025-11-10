import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { findUserByEmail } from "./user.service.js";
import { JWT_SECRET } from "../config/configEnv.js";

export async function loginUser(email, password) {
  const user = await findUserByEmail(email);
  if (!user) {
    throw new Error("Credenciales incorrectas");
  }

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

  delete user.password;
  return { user, token };
}
