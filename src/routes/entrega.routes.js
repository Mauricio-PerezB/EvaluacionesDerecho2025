import { Router } from 'express';
import { EntregaController } from '../controllers/entrega.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { checkRole } from '../middleware/role.middleware.js';

const router = Router();
const controller = new EntregaController();

const PROFESOR = ['PROFESOR'];
const ALUMNO = ['ALUMNO'];

router.post(
    '/',
    authMiddleware,
    checkRole(PROFESOR),
    controller.createEntrega.bind(controller)
);

router.get(
    '/evaluacion/:evalId/mi-entrega',
    authMiddleware,
    checkRole(ALUMNO),
    controller.getMiEntrega.bind(controller)
);

router.get(
    '/evaluacion/:evalId/todas',
    authMiddleware,
    checkRole(PROFESOR),
    controller.getEntregasByEvaluacion.bind(controller)
);

router.delete(
    '/:id',
    authMiddleware,
    checkRole(PROFESOR),
    controller.deleteEntrega.bind(controller)
);
export default router;