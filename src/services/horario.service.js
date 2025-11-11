import { HorariosDB, HorarioEntity } from '../entities/horario.entity.js';

class HorarioService {
    
    static create(data) {
        if (!data.fecha || !data.hora || !data.duracionMinutos) {
            throw new Error("Datos de horario incompletos.");
        }
        const nuevoHorario = new HorarioEntity(data);
        HorariosDB.push(nuevoHorario);
        return nuevoHorario;
    }

    static findAll(disponibles = false) {
        if (disponibles) {
            return HorariosDB.filter(h => h.disponible);
        }
        return HorariosDB;
    }

    static asignar(horarioId, estudianteId) {
        if (!estudianteId) {
             throw new Error("Se requiere el ID del estudiante para la asignación.");
        }
        
        const horario = HorariosDB.find(h => h.id === horarioId);

        if (!horario) {
            throw new Error("Franja horaria no encontrada.");
        }

        if (!horario.disponible || horario.estudianteId !== null) {
            throw new Error("Franja horaria ya está asignada a otro estudiante.");
        }

        const conflicto = HorariosDB.some(h => h.estudianteId === estudianteId);
        if (conflicto) {
            throw new Error("El estudiante ya tiene un turno asignado en otro horario.");
        }

    
        horario.disponible = false;
        horario.estudianteId = estudianteId;

        return horario;
    }
    

    static cancelar(horarioId) {
         const horario = HorariosDB.find(h => h.id === horarioId);
         if (!horario) {
             throw new Error("Franja horaria no encontrada.");
         }
         if (horario.disponible) {
             throw new Error("Este horario ya está disponible.");
         }
         horario.disponible = true;
         horario.estudianteId = null;
         return horario;
    }
}

export default HorarioService;

export const createHorario = HorarioService.create;
export const findAllHorarios = HorarioService.findAll;
export const asignarHorario = HorarioService.asignar;
export const cancelarHorario = HorarioService.cancelar;