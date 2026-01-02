import { Router } from "express";
import { verifyProfessor } from "../middleware/auth.middleware.js";
import {
  getAllPreguntas,
  getPreguntaById,
  getPreguntaByUnidad,
  createPregunta,
  updatePregunta,
  deletePregunta
} from "../controllers/pregunta.controller.js";

const router = Router();

router.get("/", getAllPreguntas);
router.get("/:id", getPreguntaById);
router.get("/unidad/:unidadId", getPreguntaByUnidad);
router.post("/", verifyProfessor, createPregunta);
router.put("/:id", verifyProfessor, updatePregunta);
router.delete("/:id", verifyProfessor, deletePregunta);

export default router;
