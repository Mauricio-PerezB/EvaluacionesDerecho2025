

import { Router } from 'express';
import { InteraccionCalificacionController } from '../controllers/interaccionCalificacion.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { checkRole } from '../middleware/role.middleware.js';

const router = Router();
const interaccionController = new InteraccionCalificacionController();

router.post(
    '/alumno', 
    authMiddleware, 
    checkRole(['ALUMNO']), 
    interaccionController.createInteraccionAlumno
);

router.post(
    '/docente', 
    authMiddleware, 
    checkRole(['PROFESOR']), 
    interaccionController.createInteraccionDocente
);

export default router;