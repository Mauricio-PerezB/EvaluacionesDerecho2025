import { Router } from "express";
import { CalificacionController } from "../controllers/calificacion.controller.js";
import { createCalificacionManual } from "../controllers/admin.controller.js";

import { authMiddleware } from "../middleware/auth.middleware.js"; 

const router = Router();
const controller = new CalificacionController();

router.post("/", authMiddleware, createCalificacionManual); 
router.get("/:id/detalle", authMiddleware, controller.getDetalleParaAlumno);
router.post("/:id/apelar", authMiddleware, controller.apelarCalificacion);
router.get("/docente/bandeja", authMiddleware, controller.getBandejaProfesor);
router.put("/docente/responder/:interaccionId", authMiddleware, controller.responderApelacion);

export default router;