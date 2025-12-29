import { AppDataSource } from "../config/configDb.js";
import { CalificacionSchema } from "../entities/calificacion.entity.js";
import { InteraccionCalificacionSchema } from "../entities/InteraccionCalificacion.entity.js";
import { handleErrorClient, handleErrorServer, handleSuccess } from "../Handlers/responseHandlers.js";

export class CalificacionController {

    // 1. Ver detalle (Requisito: Nota, Retro, Fecha, Porcentaje)
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

    // 2. Apelar (Requisito: Límite 24 horas)
    async apelarCalificacion(req, res) {
        try {
            const califRepo = AppDataSource.getRepository(CalificacionSchema);
            const interaccionRepo = AppDataSource.getRepository(InteraccionCalificacionSchema);
            
            const { id } = req.params; 
            const { contenido } = req.body;
            const usuarioId = req.user.id; 

            const calif = await califRepo.findOneBy({ id: parseInt(id) });
            if (!calif) return handleErrorClient(res, 404, "Calificación no encontrada");

            // LÓGICA DE 24 HORAS
            const ahora = new Date();
            const fechaSubida = new Date(calif.fechaSubida);
            const diferenciaHoras = (ahora - fechaSubida) / (1000 * 60 * 60);

            if (diferenciaHoras > 24) {
                return handleErrorClient(res, 403, "El plazo de 24 horas para enviar comentarios ha expirado.");
            }

            const nuevaInteraccion = interaccionRepo.create({
                contenido,
                tipoInteraccion: "INICIAL_ALUMNO",
                calificacion: calif,
                autor: { id: usuarioId }
            });

            await interaccionRepo.save(nuevaInteraccion);
            handleSuccess(res, 201, "Comentario enviado al docente con éxito.");
        } catch (error) {
            handleErrorServer(res, 500, "Error al enviar apelación", error.message);
        }
    }

    // 3. Bandeja Profesor
    async getBandejaProfesor(req, res) {
        try {
            const interaccionRepo = AppDataSource.getRepository(InteraccionCalificacionSchema);
            
            const dudas = await interaccionRepo.find({
                where: { tipoInteraccion: "INICIAL_ALUMNO" },
                relations: ["calificacion", "autor"],
                order: { fechaEnvio: "DESC" }
            });

            handleSuccess(res, 200, "Bandeja de apelaciones obtenida", dudas);
        } catch (error) {
            handleErrorServer(res, 500, "Error al cargar bandeja", error.message);
        }
    }

    // 4. Responder y cambiar nota
    async responderApelacion(req, res) {
        try {
            const califRepo = AppDataSource.getRepository(CalificacionSchema);
            const interaccionRepo = AppDataSource.getRepository(InteraccionCalificacionSchema);
            
            const { interaccionId } = req.params; // Sincronizado con la ruta
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