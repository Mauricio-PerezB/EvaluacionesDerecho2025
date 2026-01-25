import { HorariosDB, HorarioEntity } from '../entities/horario.entity.js';
import { SEMESTER_START, SEMESTER_END } from '../config/configEnv.js';

class HorarioService {
    static create(data) {
        if (!data.fecha || !data.hora || !data.duracionMinutos) {
            throw new Error('Datos de horario incompletos.');
        }

        const parseDateTime = (fecha, hora) => {
            const [y, m, d] = fecha.split('-').map(Number);
            const [hh, mm] = hora.split(':').map(Number);
            return new Date(y, m - 1, d, hh, mm);
        };

        if (SEMESTER_START && SEMESTER_END) {
            const inicio = new Date(SEMESTER_START);
            const fin = new Date(SEMESTER_END);
            const inicioSlot = parseDateTime(data.fecha, data.hora);
            if (inicioSlot < inicio || inicioSlot > fin) {
                throw new Error('La franja horaria debe estar dentro del rango semestral.');
            }
        }

        const existe = HorariosDB.some(
            (h) => h.fecha === data.fecha && h.hora === data.hora && h.duracionMinutos === parseInt(data.duracionMinutos)
        );
        if (existe) throw new Error('Ya existe una franja exactamente igual.');

        const nuevoHorario = new HorarioEntity(data);
        if (data.modalidad) nuevoHorario.modalidad = data.modalidad;
        if (data.plataforma) nuevoHorario.plataforma = data.plataforma;
        if (data.link) nuevoHorario.link = data.link;
        if (data.publicado) nuevoHorario.publicado = true;

        HorariosDB.push(nuevoHorario);
        return nuevoHorario;
    }

    static findAll(options = {}) {
        const { disponibles = false, publicados = true } = options;
        let results = HorariosDB.slice();
        if (publicados) results = results.filter((h) => h.publicado === true);
        if (disponibles) results = results.filter((h) => h.disponible === true);
        return results;
    }

    static asignar(horarioId, estudianteId) {
        if (!estudianteId) throw new Error('Se requiere el ID del estudiante para la asignación.');

        const horario = HorariosDB.find((h) => h.id === horarioId);
        if (!horario) throw new Error('Franja horaria no encontrada.');
        if (!horario.disponible || horario.estudianteId !== null) throw new Error('Franja horaria ya está asignada a otro estudiante.');

        const parseDateTime = (fecha, hora) => {
            const [y, m, d] = fecha.split('-').map(Number);
            const [hh, mm] = hora.split(':').map(Number);
            return new Date(y, m - 1, d, hh, mm);
        };

        const startA = parseDateTime(horario.fecha, horario.hora);
        const endA = new Date(startA.getTime() + horario.duracionMinutos * 60000);

        const conflictoSolapamiento = HorariosDB.some((h) => {
            if (!h.estudianteId || h.estudianteId !== estudianteId) return false;
            const startB = parseDateTime(h.fecha, h.hora);
            const endB = new Date(startB.getTime() + h.duracionMinutos * 60000);
            return startA < endB && startB < endA;
        });
        if (conflictoSolapamiento) throw new Error('El estudiante tiene otro turno que solapa con esta franja.');

        horario.disponible = false;
        horario.estudianteId = estudianteId;
        return horario;
    }

    static cancelar(horarioId) {
        const horario = HorariosDB.find((h) => h.id === horarioId);
        if (!horario) throw new Error('Franja horaria no encontrada.');
        if (horario.disponible) throw new Error('Este horario ya está disponible.');
        horario.disponible = true;
        horario.estudianteId = null;
        return horario;
    }

    static publicar(horarioId) {
        const horario = HorariosDB.find((h) => h.id === horarioId);
        if (!horario) throw new Error('Franja horaria no encontrada.');
        horario.publicado = true;
        return horario;
    }

    static despublicar(horarioId) {
        const horario = HorariosDB.find((h) => h.id === horarioId);
        if (!horario) throw new Error('Franja horaria no encontrada.');
        horario.publicado = false;
        return horario;
    }
}

export default HorarioService;

export function createHorario(data) {
    return HorarioService.create(data);
}

export function findAllHorarios(disponiblesOrOptions = {}) {
    if (typeof disponiblesOrOptions === 'boolean') {
        return HorarioService.findAll({ disponibles: disponiblesOrOptions, publicados: true });
    }
    return HorarioService.findAll(disponiblesOrOptions);
}

export function asignarHorario(horarioId, estudianteId) {
    return HorarioService.asignar(horarioId, estudianteId);
}

export function cancelarHorario(horarioId) {
    return HorarioService.cancelar(horarioId);
}

export function publicarHorario(horarioId) {
    return HorarioService.publicar(horarioId);
}

export function despublicarHorario(horarioId) {
    return HorarioService.despublicar(horarioId);
}