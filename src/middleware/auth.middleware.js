import jwt from "jsonwebtoken";
import { handleErrorClient } from "../Handlers/responseHandlers.js";

function getToken(req) {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
  return authHeader.split(" ")[1];
}

<<<<<<< Updated upstream
  if (!authHeader) {
    return handleErrorClient(res, 401, "Acceso denegado. No se proporcionó token.");
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return handleErrorClient(res, 401, "Acceso denegado. Token malformado.");
  }
=======
export function authMiddleware(req, res, next) {
  const token = getToken(req);
  if (!token) return handleErrorClient(res, 401, "Acceso denegado. Token no proporcionado o malformado.");
>>>>>>> Stashed changes

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
<<<<<<< Updated upstream
    next();
  } catch (error) {
    return handleErrorClient(res, 401, "Token inválido o expirado.", error.message);
=======
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return handleErrorClient(res, 401, "Token expirado. Por favor, inicie sesión de nuevo.", error.message);
    }
    return handleErrorClient(res, 401, "Token no es válido.", error.message);
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
    if (error.name === 'TokenExpiredError') {
      return handleErrorClient(res, 401, "Token expirado. Por favor, inicie sesión de nuevo.", error.message);
    }
    return handleErrorClient(res, 401, "Token no es válido.", error.message);
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
    if (error.name === 'TokenExpiredError') {
      return handleErrorClient(res, 401, "Token expirado. Por favor, inicie sesión de nuevo.", error.message);
    }
    return handleErrorClient(res, 401, "Token no es válido.", error.message);
>>>>>>> Stashed changes
  }
}
