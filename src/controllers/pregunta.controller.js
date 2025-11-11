"use strict";

import {
  createPreguntaService,
  deletePreguntaService,
  getPreguntasService,
  getPreguntaByIdService,
  updatePreguntaService,
  getPreguntasByUnidadService,
  getPreguntasByProfesorService,
  getPreguntasByAlumnoService,
  assignPreguntaToAlumnoService,
  unassignPreguntaFromAlumnoService,
} from "../services/pregunta.service.js";

import {
  preguntaBodyValidation,
  preguntaUpdateValidation,
  preguntaIdValidation,
  preguntaAssignValidation,
} from "../validations/pregunta.validation.js";

import {
  handleErrorClient,
  handleErrorServer,
  handleSuccess,
} from "../handlers/responseHandlers.js";

export async function createPregunta(req, res) {
  try {
    const { body } = req;
    await preguntaBodyValidation.validateAsync(body);

    const nuevaPregunta = await createPreguntaService(body);
    handleSuccess(res, 201, "Pregunta creada exitosamente", nuevaPregunta);
  } catch (error) {
    handleErrorClient(res, 500, "Error creando la pregunta", error);
  }
}

export async function getPreguntas(req, res) {
  try {
    const preguntas = await getPreguntasService();
    handleSuccess(res, 200, "Preguntas obtenidas exitosamente", preguntas);
  } catch (error) {
    handleErrorServer(res, "Error obteniendo las preguntas", error);
  }
}

export async function getPreguntaById(req, res) {
  try {
    const { id } = req.params;
    await preguntaIdValidation.validateAsync({ id });

    const pregunta = await getPreguntaByIdService(id);
    handleSuccess(res, 200, "Pregunta obtenida exitosamente", pregunta);
  } catch (error) {
    handleErrorClient(res, 500, "Error obteniendo la pregunta por ID", error);
  }
}

export async function updatePregunta(req, res) {
  try {
    const { id } = req.params;
    const { body } = req;

    await preguntaIdValidation.validateAsync({ id });
    await preguntaUpdateValidation.validateAsync(body);

    const [updatedPregunta, errorMsg] = await updatePreguntaService(id, body);
    if (errorMsg) return handleErrorClient(res, 404, errorMsg);

    handleSuccess(res, 200, "Pregunta actualizada exitosamente", updatedPregunta);
  } catch (error) {
    handleErrorClient(res, 500, "Error actualizando la pregunta", error);
  }
}

export async function deletePregunta(req, res) {
  try {
    const { id } = req.params;
    await preguntaIdValidation.validateAsync({ id });

    const [deletedPregunta, errorMsg] = await deletePreguntaService(id);
    if (errorMsg) return handleErrorClient(res, 404, errorMsg);

    handleSuccess(res, 200, "Pregunta eliminada exitosamente", deletedPregunta);
  } catch (error) {
    handleErrorClient(res, 500, "Error eliminando la pregunta", error);
  }
}

export async function getPreguntasByUnidad(req, res) {
  try {
    const { unidadId } = req.params;
    await preguntaIdValidation.validateAsync({ id: unidadId });

    const preguntas = await getPreguntasByUnidadService(unidadId);
    handleSuccess(res, 200, "Preguntas obtenidas por unidad", preguntas);
  } catch (error) {
    handleErrorClient(res, 500, "Error obteniendo preguntas por unidad", error);
  }
}

export async function getPreguntasByProfesor(req, res) {
  try {
    const { profesorId } = req.params;
    await preguntaIdValidation.validateAsync({ id: profesorId });

    const preguntas = await getPreguntasByProfesorService(profesorId);
    handleSuccess(res, 200, "Preguntas obtenidas por profesor", preguntas);
  } catch (error) {
    handleErrorClient(res, 500, "Error obteniendo preguntas por profesor", error);
  }
}

export async function getPreguntasByAlumno(req, res) {
  try {
    const { alumnoId } = req.params;
    await preguntaIdValidation.validateAsync({ id: alumnoId });

    const preguntas = await getPreguntasByAlumnoService(alumnoId);
    handleSuccess(res, 200, "Preguntas obtenidas por alumno", preguntas);
  } catch (error) {
    handleErrorClient(res, 500, "Error obteniendo preguntas por alumno", error);
  }
}

export async function assignPreguntaToAlumno(req, res) {
  try {
    const { body } = req;
    await preguntaAssignValidation.validateAsync(body);

    const { preguntaId, alumnoId } = body;
    const pregunta = await assignPreguntaToAlumnoService(preguntaId, alumnoId);

    handleSuccess(res, 200, "Pregunta asignada correctamente", pregunta);
  } catch (error) {
    handleErrorClient(res, 500, "Error asignando la pregunta al alumno", error);
  }
}

export async function unassignPreguntaFromAlumno(req, res) {
  try {
    const { preguntaId } = req.params;
    await preguntaIdValidation.validateAsync({ id: preguntaId });

    const pregunta = await unassignPreguntaFromAlumnoService(preguntaId);
    handleSuccess(res, 200, "Pregunta desasignada correctamente", pregunta);
  } catch (error) {
    handleErrorClient(res, 500, "Error desasignando la pregunta del alumno", error);
  }
}