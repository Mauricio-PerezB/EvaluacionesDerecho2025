// controllers/calificacion.controller.js

import { AppDataSource } from "../config/configDb.js";
import { CalificacionSchema } from "../entities/calificacion.entity.js";
import { handleErrorClient, handleErrorServer, handleSuccess } from "../Handlers/responseHandlers.js";

const CalificacionRepository = AppDataSource.getRepository(CalificacionSchema);

export class CalificacionController {

    /**
     * @route PUT /api/calificaciones/:id
     * @description Actualiza la nota y/o retroalimentación de una calificación. Solo para PROFESOR.
     */
    async updateCalificacion(req, res) {
        try {
            const { id } = req.params;
            const { nota, retroalimentacionDocente } = req.body; 
            
            if (!id || isNaN(id)) {
                return handleErrorClient(res, 400, "ID de Calificación inválido.");
            }
            if (nota === undefined && retroalimentacionDocente === undefined) {
                return handleErrorClient(res, 400, "Se requiere al menos la 'nota' o la 'retroalimentacionDocente' para actualizar.");
            }
            
            const calificacionToUpdate = await CalificacionRepository.findOneBy({ id: parseInt(id) });
            
            if (!calificacionToUpdate) {
                return handleErrorClient(res, 404, `Calificación con ID ${id} no encontrada.`);
            }

            const changes = {};
            if (nota !== undefined) changes.nota = nota;
            if (retroalimentacionDocente !== undefined) changes.retroalimentacionDocente = retroalimentacionDocente;

            CalificacionRepository.merge(calificacionToUpdate, changes);
            const calificacionActualizada = await CalificacionRepository.save(calificacionToUpdate);
            
            handleSuccess(res, 200, "Calificación y/o retroalimentación actualizada exitosamente", calificacionActualizada);
        } catch (error) {
            handleErrorServer(res, 500, "Error al actualizar la calificación", error.message);
        }
    }
}