import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  getAllPreguntas,
  getPreguntaById,
  createPregunta,
  updatePregunta,
  deletePregunta
} from "../controllers/pregunta.controller.js";

const router = Router();

router.get("/", getAllPreguntas);
router.get("/:id", getPreguntaById);
router.post("/", createPregunta);
router.put("/:id", updatePregunta);
router.delete("/:id", deletePregunta);

export default router;