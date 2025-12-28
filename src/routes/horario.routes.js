import { Router } from "express";
import { verifyProfessor, verifyStudent } from "../middleware/auth.middleware.js";
<<<<<<< HEAD
import HorarioController, {
  create,
  asignarDirecta,
  cancelar,
  findAll,
  seleccionar,
} from "../controllers/horario.controller.js";
=======
import { createHorario, findAllHorarios, asignarHorario, cancelarHorario } from "../services/horario.service.js";
import { success, error } from "../Handlers/responseHandlers.js";


const create = (req, res) => {
	try {
		const nuevo = createHorario(req.body);
		return success(res, 201, 'Franja horaria creada.', nuevo);
	} catch (err) {
		return error(res, 400, err.message);
	}
};

const findAll = (req, res) => {
	try {
		const soloDisponibles = req.query.disponibles === 'true';
		const list = findAllHorarios(soloDisponibles);
		return success(res, 200, 'Horarios obtenidos.', list);
	} catch (err) {
		return error(res, 500, 'Error al obtener horarios.');
	}
};

const seleccionar = (req, res) => {
	try {
		const { horarioId } = req.params;
		const { estudianteId } = req.body;
		const assigned = asignarHorario(horarioId, estudianteId);
		return success(res, 200, 'Turno seleccionado exitosamente.', assigned);
	} catch (err) {
		const status = err.message.includes('asignada') || err.message.includes('otro turno') ? 409 : 400;
		return error(res, status, err.message);
	}
};

const asignarDirecta = (req, res) => seleccionar(req, res);

const cancelar = (req, res) => {
	try {
		const { horarioId } = req.params;
		const h = cancelarHorario(horarioId);
		return success(res, 200, 'Turno cancelado y liberado.', h);
	} catch (err) {
		return error(res, 400, err.message);
	}
};
>>>>>>> main

const router = Router();

router.post("/", verifyProfessor, create);
router.put("/:horarioId/asignar", verifyProfessor, asignarDirecta);
router.delete("/:horarioId/cancelar", verifyProfessor, cancelar);
// Publicar / Despublicar (Profesor)
router.put('/:horarioId/publicar', verifyProfessor, (req, res) => HorarioController.publicar(req, res));
router.put('/:horarioId/despublicar', verifyProfessor, (req, res) => HorarioController.despublicar(req, res));

router.get("/", findAll);
router.post("/:horarioId/seleccionar", verifyStudent, seleccionar);

export default router;