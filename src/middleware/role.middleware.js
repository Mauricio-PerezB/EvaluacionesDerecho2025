import { handleErrorClient } from "../Handlers/responseHandlers.js";

export const checkRole = (rolesPermitidos) => {
    return (req, res, next) => {
        try {
            const userRole = req.user.rol; // Viene del token decodificado en authMiddleware

            if (!rolesPermitidos.includes(userRole)) {
                return handleErrorClient(
                    res, 
                    403, 
                    "No tienes permisos suficientes para realizar esta acción."
                );
            }
            next();
        } catch (error) {
            return handleErrorClient(res, 500, "Error en la validación de roles.");
        }
    };
};