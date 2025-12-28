import { HorariosDB, HorarioEntity } from '../entities/horario.entity.js';
import { SEMESTER_START, SEMESTER_END } from '../config/configEnv.js';

// El servicio maneja la interacción con la "DB" y las reglas de negocio.
class HorarioService {
    
    // 📝 Crea y define una nueva franja horaria.
    static create(data) {
        if (!data.fecha || !data.hora || !data.duracionMinutos) {
            throw new Error("Datos de horario incompletos.");
        }

        // Validar rango semestral si está configurado
        const parseDateTime = (fecha, hora) => {
            // fecha: 'YYYY-MM-DD', hora: 'HH:mm' (24h)
            const [y, m, d] = fecha.split('-').map(Number);
            const [hh, mm] = hora.split(':').map(Number);
            return new Date(y, m - 1, d, hh, mm);
        };

        if (SEMESTER_START && SEMESTER_END) {
            const inicio = new Date(SEMESTER_START);
            const fin = new Date(SEMESTER_END);
            const inicioSlot = parseDateTime(data.fecha, data.hora);
            if (inicioSlot < inicio || inicioSlot > fin) {
                throw new Error("La franja horaria debe estar dentro del rango semestral.");
            }
        }

        // Evitar duplicados exactos (misma fecha, hora y duración)
        const existe = HorariosDB.some(h => h.fecha === data.fecha && h.hora === data.hora && h.duracionMinutos === parseInt(data.duracionMinutos));
        if (existe) {
            throw new Error("Ya existe una franja exactamente igual.");
        }

        const nuevoHorario = new HorarioEntity(data);
        // Aceptar opciones opcionales
        if (data.modalidad) nuevoHorario.modalidad = data.modalidad;
        if (data.plataforma) nuevoHorario.plataforma = data.plataforma;
        if (data.link) nuevoHorario.link = data.link;
        if (data.publicado) nuevoHorario.publicado = true;

        HorariosDB.push(nuevoHorario);
        return nuevoHorario;
    }

    // 🔎 Obtiene horarios (disponibles o todos).
    static findAll(options = {}) {
        const { disponibles = false, publicados = true } = options;
        let results = HorariosDB.slice();
        if (publicados) {
            results = results.filter(h => h.publicado === true);
        }
        if (disponibles) {
            results = results.filter(h => h.disponible === true);
        }
        return results;
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

        // 2. **Verificar Conflicto** (Asegurar que el estudiante no tiene otro turno asignado)
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

    // Publicar una franja (solo profesor)
    static publicar(horarioId) {
        const horario = HorariosDB.find(h => h.id === horarioId);
        if (!horario) throw new Error('Franja horaria no encontrada.');
        horario.publicado = true;
        return horario;
    }

    static despublicar(horarioId) {
        const horario = HorariosDB.find(h => h.id === horarioId);
        if (!horario) throw new Error('Franja horaria no encontrada.');
        horario.publicado = false;
        return horario;
    }
}

export default HorarioService;