
import { Router } from 'express';
import { RamoController } from '../controllers/ramo.controller.js'; 
import { authMiddleware } from '../middleware/auth.middleware.js';
import { checkRole } from '../middleware/role.middleware.js'; 
import { createRamo } from "../controllers/admin.controller.js";



const router = Router();
const ramoController = new RamoController();

const rolesPermitidosGestion = ['PROFESOR']; 


router.get('/', authMiddleware, (req, res, next) => ramoController.getAllRamos(req, res, next));
router.get('/:id', authMiddleware, (req, res, next) => ramoController.getRamoById(req, res, next));

router.post(
  '/',
  authMiddleware,
  checkRole(rolesPermitidosGestion),
  (req, res, next) => ramoController.createRamo(req, res, next)
);

router.put(
  '/:id',
  authMiddleware,
  checkRole(rolesPermitidosGestion),
  (req, res, next) => ramoController.updateRamo(req, res, next)
);

router.delete(
  '/:id',
  authMiddleware,
  checkRole(rolesPermitidosGestion),
  (req, res, next) => ramoController.deleteRamo(req, res, next)
);

router.post("/", createRamo); // Esto habilita el POST /api/ramos

export default router;
