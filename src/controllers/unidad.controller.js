import { findAll } from "../services/unidad.service.js";
import { handleSuccess, handleErrorServer } from "../Handlers/responseHandlers.js";

export const getAllUnidades = async (req, res) => {
    try {
        const preguntas = await findAll();
        handleSuccess(res, 200, "Preguntas obtenidas exitosamente.", preguntas);
    } catch (error) {
        handleErrorServer(res, 500, "Error al obtener las preguntas.", error.message);
    }
}