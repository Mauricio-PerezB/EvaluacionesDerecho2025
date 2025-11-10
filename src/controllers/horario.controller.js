const HorarioService = require('../services/horario.service');
// Asumiendo que responseHandlers maneja la estructura de la respuesta
const { success, error } = require('../handlers/responseHandlers'); 

class HorarioController {
    
    static async create(req, res) {
        try {
            const nuevoHorario = HorarioService.create(req.body);
            return success(res, 201, "Franja horaria creada.", nuevoHorario);
        } catch (err) {
            return error(res, 400, err.message);
        }
    }

    static async findAll(req, res) {
        try {
            const soloDisponibles = req.query.disponibles === 'true';
            const horarios = HorarioService.findAll(soloDisponibles);
            return success(res, 200, "Horarios obtenidos.", horarios);
        } catch (err) {
            return error(res, 500, "Error al obtener horarios.");
        }
    }

  
    static async seleccionar(req, res) {
        try {
            const { horarioId } = req.params;
            const { estudianteId } = req.body; 
            
            // La lógica de exclusividad está en el servicio.
            const horarioAsignado = HorarioService.asignar(horarioId, estudianteId);

            return success(res, 200, "Turno seleccionado exitosamente.", horarioAsignado);
        } catch (err) {
            const status = err.message.includes("asignada") || err.message.includes("otro turno") ? 409 : 400;
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
             return success(res, 200, "Turno cancelado y liberado.", horarioLiberado);
         } catch (err) {
             return error(res, 400, err.message);
         }
    }
}

module.exports = HorarioController;