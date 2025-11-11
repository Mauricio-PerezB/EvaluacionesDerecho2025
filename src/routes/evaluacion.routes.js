import { Router } from 'express';
import { EvaluacionController } from '../controllers/evaluacion.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { checkRole } from '../middleware/role.middleware.js';

const router = Router();
const controller = new EvaluacionController();

const PROFESOR = ['PROFESOR'];
const TODOS = ['PROFESOR', 'ALUMNO'];

router.get(
    '/:id', 
    authMiddleware, 
    checkRole(TODOS), 
    controller.getEvaluacionDetalle
);

router.post(
    '/:evalId/criterios',
    authMiddleware,
    checkRole(PROFESOR),
    controller.addCriterio
);

export default router;