import {
  findAll,
  findById,
  create,
  update,
  remove
} from "../services/pregunta.service.js";
import { handleSuccess, handleErrorClient, handleErrorServer } from "../Handlers/responseHandlers.js";

export const getAllPreguntas = async (req, res) => {
    try {
        const preguntas = await findAll();
        handleSuccess(res, 200, "Preguntas obtenidas exitosamente.", preguntas);
    } catch (error) {
        handleErrorServer(res, 500, "Error al obtener las preguntas.", error.message);
    }
}

export const getPreguntaById = async (req, res) => {
  try {
    const { id } = req.params;
    const pregunta = await findById(parseInt(id));

    if (!pregunta) {
      return handleErrorClient(res, 404, `No se encontró la pregunta con id ${id}`);
    }

    handleSuccess(res, 200, "Pregunta obtenida exitosamente.", pregunta);
  } catch (error) {
    handleErrorServer(res, 500, "Error al obtener la pregunta.", error.message);
  }
};

export const createPregunta = async (req, res) => {
  try {
    const { pregunta, respuesta, unidad_id } = req.body;

    if (!pregunta || !respuesta) {
      return handleErrorClient(res, 400, "Los campos 'pregunta' y 'respuesta' son obligatorios.");
    }

    const nuevaPregunta = await create({ pregunta, respuesta, unidad_id });
    handleSuccess(res, 201, "Pregunta creada exitosamente.", nuevaPregunta);
  } catch (error) {
    handleErrorServer(res, 500, "Error al crear la pregunta.", error.message);
  }
};

export const updatePregunta = async (req, res) => {
  try {
    const { id } = req.params;
    const { pregunta, respuesta, unidad_id } = req.body;

    const preguntaActualizada = await update(parseInt(id), { pregunta, respuesta, unidad_id });
    handleSuccess(res, 200, "Pregunta actualizada exitosamente.", preguntaActualizada);
  } catch (error) {
    if (error.message.includes("no encontrada")) {
      handleErrorClient(res, 404, error.message);
    } else {
      handleErrorServer(res, 500, "Error al actualizar la pregunta.", error.message);
    }
  }
};

export const deletePregunta = async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await remove(parseInt(id));
    handleSuccess(res, 200, "Pregunta eliminada exitosamente.", resultado);
  } catch (error) {
    if (error.message.includes("no encontrada")) {
      handleErrorClient(res, 404, error.message);
    } else {
      handleErrorServer(res, 500, "Error al eliminar la pregunta.", error.message);
    }
  }
};