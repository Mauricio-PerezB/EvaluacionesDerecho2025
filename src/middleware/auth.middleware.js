import jwt from "jsonwebtoken";
import { handleErrorClient } from "../Handlers/responseHandlers.js"; 

export function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return handleErrorClient(res, 401, "Acceso denegado. Token no proporcionado o malformado.");
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return handleErrorClient(res, 401, "Acceso denegado. Token malformado.");
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; 
    next();
  } catch (error) {
    
    if (error.name === 'TokenExpiredError') {
      return handleErrorClient(res, 401, "Token expirado. Por favor, inicie sesión de nuevo.", error.message);
    }
    
    return handleErrorClient(res, 401, "Token no es válido.", error.message);
  }
}