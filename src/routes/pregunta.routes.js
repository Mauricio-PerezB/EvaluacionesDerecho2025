"use strict";

import { Router } from "express";
import {
  createPregunta,
  getPreguntas,
  getPreguntaById,
  updatePregunta,
  deletePregunta,
  getPreguntasByUnidad,
  getPreguntasByProfesor,
  getPreguntasByAlumno,
  assignPreguntaToAlumno,
  unassignPreguntaFromAlumno,
} from "../controllers/pregunta.controller.js";

const router = Router();

router.post("/", createPregunta);
router.get("/", getPreguntas);
router.get("/:id", getPreguntaById);
router.put("/:id", updatePregunta);
router.delete("/:id", deletePregunta);

router.get("/unidad/:unidadId", getPreguntasByUnidad); 
router.get("/profesor/:profesorId", getPreguntasByProfesor); 
router.get("/alumno/:alumnoId", getPreguntasByAlumno); 

router.post("/asignar", assignPreguntaToAlumno); 
router.put("/desasignar/:preguntaId", unassignPreguntaFromAlumno);

export default router;
