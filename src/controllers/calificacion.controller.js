import { AppDataSource } from "../config/configDb.js";
import { CalificacionSchema } from "../entities/calificacion.entity.js";
import { InteraccionCalificacionSchema } from "../entities/InteraccionCalificacion.entity.js";
import { handleErrorClient, handleErrorServer, handleSuccess } from "../Handlers/responseHandlers.js";

export class CalificacionController {

    async getDetalleParaAlumno(req, res) {
        try {
            const califRepo = AppDataSource.getRepository(CalificacionSchema);
            const { id } = req.params;

            const calificacion = await califRepo.findOne({
                where: { id: parseInt(id) },
                relations: ["entrega", "entrega.evaluacion", "interacciones", "interacciones.autor"] 
            });

            if (!calificacion) return handleErrorClient(res, 404, "Calificación no encontrada");

            handleSuccess(res, 200, "Detalle obtenido", {
                nota: calificacion.nota,
                retroalimentacionDocente: calificacion.retroalimentacionDocente,
                fechaEvaluacion: calificacion.entrega?.evaluacion?.fechaRealizacion || "No definida",
                porcentajeRamo: calificacion.entrega?.evaluacion?.porcentajeRamo || 0,
                historialInteracciones: calificacion.interacciones
            });
        } catch (error) {
            handleErrorServer(res, 500, "Error al obtener detalle", error.message);
        }
    }

    async apelarCalificacion(req, res) {
        try {
            const { id } = req.params; 
            const { contenido } = req.body;

            if (!req.user || !req.user.id) {
                return res.status(401).json({ 
                    message: "No autorizado. El usuario no pudo ser identificado." 
                });
            }
            
            const usuarioId = req.user.id; 
            const califRepo = AppDataSource.getRepository(CalificacionSchema);
            const interaccionRepo = AppDataSource.getRepository(InteraccionCalificacionSchema);

            const calificacion = await califRepo.findOne({ where: { id: parseInt(id) } });

            if (!calificacion) {
                return res.status(404).json({ message: "Calificación no encontrada con el ID: " + id });
            }

            const ahora = new Date();
            const fechaSubida = new Date(calificacion.fechaSubida);
            const diferenciaHoras = (ahora - fechaSubida) / (1000 * 60 * 60);

            if (diferenciaHoras > 24) {
                return res.status(403).json({ 
                    message: "El plazo para apelar (24 horas) ha expirado." 
                });
            }

            const nuevaInteraccion = interaccionRepo.create({
                contenido,
                fechaInteraccion: ahora,
                tipoInteraccion: "INICIAL_ALUMNO",
                calificacion: { id: calificacion.id }, 
                autor: { id: usuarioId }
            });

            await interaccionRepo.save(nuevaInteraccion);
            handleSuccess(res, 201, "Apelación enviada correctamente");

        } catch (error) {
            handleErrorServer(res, 500, "Error al enviar apelación", error.message);
        }
    }

    async getBandejaProfesor(req, res) {
        try {
            const interaccionRepo = AppDataSource.getRepository(InteraccionCalificacionSchema);
            
            const dudas = await interaccionRepo.find({
                where: { tipoInteraccion: "INICIAL_ALUMNO" },
                relations: ["calificacion", "autor"],
                order: { fechaInteraccion: "DESC" }
            });

            handleSuccess(res, 200, "Bandeja de apelaciones obtenida", dudas);
        } catch (error) {
            handleErrorServer(res, 500, "Error al cargar bandeja", error.message);
        }
    }

    async responderApelacion(req, res) {
        try {
            const califRepo = AppDataSource.getRepository(CalificacionSchema);
            const interaccionRepo = AppDataSource.getRepository(InteraccionCalificacionSchema);
            
            const { interaccionId } = req.params; 
            const { contenido, nuevaNota } = req.body;

            const interaccionOriginal = await interaccionRepo.findOne({
                where: { id: parseInt(interaccionId) },
                relations: ["calificacion"]
            });

            if (!interaccionOriginal) return handleErrorClient(res, 404, "La duda original no existe.");

            const respuesta = interaccionRepo.create({
                contenido,
                tipoInteraccion: "RESPUESTA_DOCENTE",
                calificacion: interaccionOriginal.calificacion,
                autor: { id: req.user.id }
            });

            await interaccionRepo.save(respuesta);

            if (nuevaNota !== undefined && nuevaNota !== null) {
                const notaActualizada = interaccionOriginal.calificacion;
                notaActualizada.nota = nuevaNota;
                await califRepo.save(notaActualizada);
            }

            handleSuccess(res, 200, "Respuesta enviada y nota procesada.");
        } catch (error) {
            handleErrorServer(res, 500, "Error al procesar respuesta", error.message);
        }
    }
}