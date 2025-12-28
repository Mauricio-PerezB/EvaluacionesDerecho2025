import jwt from "jsonwebtoken";
import { handleErrorClient } from "../Handlers/responseHandlers.js";

function getToken(req) {
  const authHeader = req.headers["authorization"] || req.headers["Authorization"];
  if (!authHeader) return null;
  if (typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
    return authHeader.split(' ')[1];
  }
  return null;
}

export function authMiddleware(req, res, next) {
<<<<<<< HEAD
  const token = getToken(req);
  if (!token) return handleErrorClient(res, 401, "Acceso denegado. Token no proporcionado o malformado.");
=======
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return handleErrorClient(res, 401, "Acceso denegado. Token no proporcionado o malformado.");
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return handleErrorClient(res, 401, "Acceso denegado. Token malformado.");
  }
>>>>>>> main

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch (error) {
<<<<<<< HEAD
    if (error && error.name === 'TokenExpiredError') {
      return handleErrorClient(res, 401, "Token expirado. Por favor, inicie sesión de nuevo.", error.message);
    }
    return handleErrorClient(res, 401, "Token no es válido.", error?.message || null);
  }
}

export function verifyProfessor(req, res, next) {
  const token = getToken(req);
  if (!token) return handleErrorClient(res, 401, "Acceso denegado. Token no proporcionado o malformado.");

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (!payload || payload.rol !== 'PROFESOR') {
      return handleErrorClient(res, 403, 'Acceso denegado. Se requiere rol PROFESOR.');
    }
    req.user = payload;
    next();
  } catch (error) {
    if (error && error.name === 'TokenExpiredError') {
      return handleErrorClient(res, 401, "Token expirado. Por favor, inicie sesión de nuevo.", error.message);
    }
    return handleErrorClient(res, 401, "Token no es válido.", error?.message || null);
  }
}

export function verifyStudent(req, res, next) {
  const token = getToken(req);
  if (!token) return handleErrorClient(res, 401, "Acceso denegado. Token no proporcionado o malformado.");

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (!payload || payload.rol !== 'ALUMNO') {
      return handleErrorClient(res, 403, 'Acceso denegado. Se requiere rol ALUMNO.');
    }
    req.user = payload;
    next();
  } catch (error) {
    if (error && error.name === 'TokenExpiredError') {
      return handleErrorClient(res, 401, "Token expirado. Por favor, inicie sesión de nuevo.", error.message);
    }
    return handleErrorClient(res, 401, "Token no es válido.", error?.message || null);
=======
    if (error.name === "TokenExpiredError") {
      return handleErrorClient(res, 401, "Token expirado. Por favor, inicie sesión de nuevo.", error.message);
    }
    return handleErrorClient(res, 401, "Token no es válido.", error.message);
>>>>>>> main
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