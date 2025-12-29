

import { Router } from 'express';
import { CalificacionController } from '../controllers/calificacion.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { checkRole } from '../middleware/role.middleware.js';

const router = Router();
const calificacionController = new CalificacionController();

router.put(
    '/:id', 
    authMiddleware, 
    checkRole(['PROFESOR']), 
    calificacionController.updateCalificacion
);

export default router;