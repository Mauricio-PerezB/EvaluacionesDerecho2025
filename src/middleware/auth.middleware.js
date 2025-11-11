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
    if (error.name === "TokenExpiredError") {
      return handleErrorClient(res, 401, "Token expirado. Por favor, inicie sesión de nuevo.", error.message);
    }
    return handleErrorClient(res, 401, "Token no es válido.", error.message);
  }
}

// Middlewares específicos de rol
export function verifyProfessor(req, res, next) {
  // Primero validar token
  authMiddleware(req, res, () => {
    const role = req.user && req.user.rol;
    if (!role || (role !== "PROFESOR" && role !== "PROF")) {
      return handleErrorClient(res, 403, "Acceso denegado. Requiere rol de profesor.");
    }
    next();
  });
}

export function verifyStudent(req, res, next) {
  authMiddleware(req, res, () => {
    const role = req.user && req.user.rol;
    if (!role || (role !== "ALUMNO" && role !== "ESTUDIANTE")) {
      return handleErrorClient(res, 403, "Acceso denegado. Requiere rol de estudiante.");
    }
    next();
  });
}