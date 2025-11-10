import { handleErrorClient } from "../Handlers/responseHandlers.js";

export const checkRole = (rolesPermitidos) => {
  
  return (req, res, next) => {
    
    if (!req.user || !req.user.rol) {
      return handleErrorClient(res, 500, "Error de servidor: Rol de usuario no encontrado.");
    }

    const { rol } = req.user;

    if (!rolesPermitidos.includes(rol)) {
      return handleErrorClient(res, 403, `Acceso denegado. Se requiere rol de ${rolesPermitidos.join(' o ')}.`);
    }

    next();
  };
};