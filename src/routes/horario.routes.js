import { Router } from "express";
import { verifyProfessor, verifyStudent } from "../middleware/auth.middleware.js";
import HorarioController, {
  create,
  asignarDirecta,
  cancelar,
  findAll,
  seleccionar,
} from "../controllers/horario.controller.js";

const router = Router();

// Rutas de Profesor (Creación, Asignación Directa, Cancelación)
router.post("/", verifyProfessor, create);
router.put("/:horarioId/asignar", verifyProfessor, asignarDirecta);
router.delete("/:horarioId/cancelar", verifyProfessor, cancelar);
// Publicar / Despublicar (Profesor)
router.put('/:horarioId/publicar', verifyProfessor, (req, res) => HorarioController.publicar(req, res));
router.put('/:horarioId/despublicar', verifyProfessor, (req, res) => HorarioController.despublicar(req, res));

// Rutas Comunes / Estudiante (Visualización y Selección)
router.get("/", findAll);
router.post("/:horarioId/seleccionar", verifyStudent, seleccionar);

export default router;