import { Router } from 'express';
import { CalificacionController } from '../controllers/calificacion.controller.js';
import { createCalificacionManual } from '../controllers/admin.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { checkRole } from '../middleware/role.middleware.js';

const router = Router();
const controller = new CalificacionController();

// Ruta para que el profesor suba notas (POST /api/calificaciones)
router.post("/", authMiddleware, checkRole(['PROFESOR']), createCalificacionManual);

// Rutas de Alumno
router.get('/:id/detalle', authMiddleware, controller.getDetalleParaAlumno);
router.post('/:id/apelar', authMiddleware, checkRole(['ALUMNO']), controller.apelarCalificacion);

// Rutas de Profesor para bandeja
router.get('/docente/bandeja', authMiddleware, checkRole(['PROFESOR']), controller.getBandejaProfesor);
router.put('/docente/responder/:interaccionId', authMiddleware, checkRole(['PROFESOR']), controller.responderApelacion);

export default router;