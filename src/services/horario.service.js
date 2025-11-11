import { HorariosDB, HorarioEntity } from '../entities/horario.entity.js';

// El servicio maneja la interacción con la "DB" y las reglas de negocio.
class HorarioService {
    
    // 📝 Crea y define una nueva franja horaria.
    static create(data) {
        if (!data.fecha || !data.hora || !data.duracionMinutos) {
            throw new Error("Datos de horario incompletos.");
        }
        const nuevoHorario = new HorarioEntity(data);
        HorariosDB.push(nuevoHorario);
        return nuevoHorario;
    }

    // 🔎 Obtiene horarios (disponibles o todos).
    static findAll(disponibles = false) {
        if (disponibles) {
            return HorariosDB.filter(h => h.disponible);
        }
        return HorariosDB;
    }

    // 🔒 Asigna un estudiante a un turno, verificando exclusividad y conflictos.
    static asignar(horarioId, estudianteId) {
        if (!estudianteId) {
             throw new Error("Se requiere el ID del estudiante para la asignación.");
        }
        
        const horario = HorariosDB.find(h => h.id === horarioId);

        if (!horario) {
            throw new Error("Franja horaria no encontrada.");
        }

        // 1. **Verificar Disponibilidad** (Exclusividad del turno)
        if (!horario.disponible || horario.estudianteId !== null) {
            throw new Error("Franja horaria ya está asignada a otro estudiante.");
        }

        // 2. **Verificar Conflicto** (Asegurar que el estudiante no tiene otro turno)
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

// Named exports for direct usage in routes (compatibility)
export const createHorario = HorarioService.create;
export const findAllHorarios = HorarioService.findAll;
export const asignarHorario = HorarioService.asignar;
export const cancelarHorario = HorarioService.cancelar;