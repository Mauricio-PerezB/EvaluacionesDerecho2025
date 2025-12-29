
import { Router } from 'express';
import { EvaluacionController } from '../controllers/evaluacion.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { checkRole } from '../middleware/role.middleware.js';

const router = Router();
const controller = new EvaluacionController();

const PROFESOR = ['PROFESOR'];
const TODOS = ['PROFESOR', 'ALUMNO'];

router.post(
    '/',
    authMiddleware,
    checkRole(PROFESOR),
    controller.createEvaluacion.bind(controller)
);

router.get(
    '/',
    authMiddleware,
    checkRole(TODOS),
    controller.getAllEvaluaciones.bind(controller)
);

router.get(
    '/:id', 
    authMiddleware, 
    checkRole(TODOS), 
    controller.getEvaluacionDetalle.bind(controller)
);

router.post(
    '/:evalId/criterios',
    authMiddleware,
    checkRole(PROFESOR),
    controller.addCriterio.bind(controller)
);

export default router;