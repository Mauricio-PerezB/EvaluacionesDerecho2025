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
    controller.createEntrega
);

router.get(
    '/evaluacion/:evalId/mi-entrega',
    authMiddleware,
    checkRole(ALUMNO),
    controller.getMiEntrega
);

export default router;