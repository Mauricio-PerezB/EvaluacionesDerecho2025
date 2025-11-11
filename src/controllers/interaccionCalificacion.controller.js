// controllers/interaccionCalificacion.controller.js

import { AppDataSource } from "../config/configDb.js";
import { InteraccionCalificacionSchema } from "../entities/InteraccionCalificacion.entity.js";
import { CalificacionSchema } from "../entities/calificacion.entity.js";
import { handleErrorClient, handleErrorServer, handleSuccess } from "../Handlers/responseHandlers.js";

const InteraccionRepository = AppDataSource.getRepository(InteraccionCalificacionSchema);
const CalificacionRepository = AppDataSource.getRepository(CalificacionSchema);

const PLAZO_MAXIMO_MS = 24 * 60 * 60 * 1000; 

export class InteraccionCalificacionController {

    /**
     * @route POST /api/interacciones/alumno
     * @description Permite al ALUMNO iniciar un proceso de apelación si está dentro de las 24h.
     */
    async createInteraccionAlumno(req, res) {
        try {
            const alumnoId = req.user.id;
            const { calificacionId, contenido } = req.body;
            
            if (!calificacionId || !contenido) {
                return handleErrorClient(res, 400, "Se requiere 'calificacionId' y 'contenido' del comentario.");
            }

            const calificacion = await CalificacionRepository.findOne({
                where: { id: calificacionId },
                relations: ["alumno"]
            });
            
            if (!calificacion) {
                return handleErrorClient(res, 404, "Calificación no encontrada.");
            }
            
            if (calificacion.alumno.id !== alumnoId) {
                 return handleErrorClient(res, 403, "No tiene permiso para comentar esta calificación.");
            }

            const fechaSubidaMs = new Date(calificacion.fechaSubida).getTime();
            const tiempoActualMs = Date.now();
            
            if (tiempoActualMs - fechaSubidaMs > PLAZO_MAXIMO_MS) {
                return handleErrorClient(res, 403, "El plazo de 24 horas para apelar esta calificación ha expirado.");
            }
            
            const nuevaInteraccion = InteraccionRepository.create({
                calificacion: calificacionId,
                autor: alumnoId,
                contenido: contenido,
                tipoInteraccion: "INICIAL_ALUMNO", 
            });

            await InteraccionRepository.save(nuevaInteraccion);
            
            handleSuccess(res, 201, "Apelación de nota enviada exitosamente. El profesor será notificado.", nuevaInteraccion);
        } catch (error) {
            handleErrorServer(res, 500, "Error al enviar la apelación del alumno", error.message);
        }
    }

    /**
     * @route POST /api/interacciones/docente
     * @description Permite al PROFESOR responder a una apelación.
     */
    async createInteraccionDocente(req, res) {
        try {
    
            const docenteId = req.user.id;
            const { calificacionId, contenido, respuestaAId, seRealizoCambioNota } = req.body;
            
            if (!calificacionId || !contenido || !respuestaAId) {
                return handleErrorClient(res, 400, "Faltan datos requeridos (calificacionId, contenido, respuestaAId).");
            }
            
            
            
            const nuevaInteraccion = InteraccionRepository.create({
                calificacion: calificacionId,
                autor: docenteId,
                contenido: contenido,
                tipoInteraccion: "RESPUESTA_DOCENTE", 
                respuestaA: respuestaAId,
                seRealizoCambioNota: seRealizoCambioNota || false,
            });

            await InteraccionRepository.save(nuevaInteraccion);
            
            handleSuccess(res, 201, "Respuesta a la apelación enviada exitosamente", nuevaInteraccion);
        } catch (error) {
            handleErrorServer(res, 500, "Error al responder la apelación", error.message);
        }
    }
}