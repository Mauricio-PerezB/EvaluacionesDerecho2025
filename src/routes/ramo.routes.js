
import { Router } from 'express';
import { RamoController } from '../controllers/ramo.controller.js'; 
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { checkRole } from '../middlewares/role.middleware.js'; 

const router = Router();
const ramoController = new RamoController();

const rolesPermitidosGestion = ['PROFESOR']; 


router.get('/', authMiddleware, ramoController.getAllRamos);
router.get('/:id', authMiddleware, ramoController.getRamoById);

router.post(
    '/', 
    authMiddleware, 
    checkRole(rolesPermitidosGestion), 
    ramoController.createRamo
);

router.put(
    '/:id', 
    authMiddleware, 
    checkRole(rolesPermitidosGestion), 
    ramoController.updateRamo
);

router.delete(
    '/:id', 
    authMiddleware, 
    checkRole(rolesPermitidosGestion), 
    ramoController.deleteRamo
);

export default router;