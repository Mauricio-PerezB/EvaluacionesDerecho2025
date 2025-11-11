// Ejemplo de archivo de rutas (calificaciones.routes.js)

import { Router } from 'express';
import { CalificacionController } from '../controllers/calificacion.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { checkRole } from '../middlewares/role.middleware.js';

const router = Router();
const calificacionController = new CalificacionController();

router.put(
    '/:id', 
    authMiddleware, 
    checkRole(['PROFESOR']), 
    calificacionController.updateCalificacion
);

export default router;