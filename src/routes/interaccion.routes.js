

import { Router } from 'express';
import { InteraccionCalificacionController } from '../controllers/interaccionCalificacion.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { checkRole } from '../middlewares/role.middleware.js';

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