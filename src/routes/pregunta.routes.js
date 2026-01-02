import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
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
router.post("/", createPregunta);
router.put("/:id", updatePregunta);
router.delete("/:id", deletePregunta);

export default router;