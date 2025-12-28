import HorarioService from '../services/horario.service.js';
import { success, error } from '../Handlers/responseHandlers.js';

class HorarioController {
    static async create(req, res) {
        try {
            const nuevoHorario = HorarioService.create(req.body);
            return success(res, 201, 'Franja horaria creada.', nuevoHorario);
        } catch (err) {
            return error(res, 400, err.message);
        }
    }

    static async findAll(req, res) {
        try {
            const soloDisponibles = req.query.disponibles === 'true';
            const horarios = HorarioService.findAll(soloDisponibles);
            return success(res, 200, 'Horarios obtenidos.', horarios);
        } catch (err) {
            return error(res, 500, 'Error al obtener horarios.');
        }
    }

    static async seleccionar(req, res) {
        try {
            const { horarioId } = req.params;
            const { estudianteId } = req.body;

            const horarioAsignado = HorarioService.asignar(horarioId, estudianteId);
            return success(res, 200, 'Turno seleccionado exitosamente.', horarioAsignado);
        } catch (err) {
            const status = err.message.includes('asignada') || err.message.includes('otro turno') ? 409 : 400;
            return error(res, status, err.message);
        }
    }

    static async asignarDirecta(req, res) {
        return HorarioController.seleccionar(req, res);
    }

    static async cancelar(req, res) {
        try {
            const { horarioId } = req.params;
            const horarioLiberado = HorarioService.cancelar(horarioId);
            return success(res, 200, 'Turno cancelado y liberado.', horarioLiberado);
        } catch (err) {
            return error(res, 400, err.message);
        }
    }
}

// Exportar como funciones nombradas para que las rutas puedan importarlas con destructuring
export const create = HorarioController.create;
export const findAll = HorarioController.findAll;
export const seleccionar = HorarioController.seleccionar;
export const asignarDirecta = HorarioController.asignarDirecta;
export const cancelar = HorarioController.cancelar;

export default HorarioController;