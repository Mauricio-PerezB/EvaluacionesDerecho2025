import { AppDataSource } from "../config/configDb.js";
import { EvaluacionSchema } from "../entities/evaluacion.entity.js";
import { CriterioSchema } from "../entities/criterio.entity.js";
import { handleErrorClient, handleErrorServer, handleSuccess } from "../Handlers/responseHandlers.js";


const evaluacionRepo = AppDataSource.getRepository(EvaluacionSchema);
const criterioRepo = AppDataSource.getRepository(CriterioSchema);

export class EvaluacionController {

    async getEvaluacionDetalle(req, res) {
        try {
            const { id } = req.params;
            const evaluacion = await evaluacionRepo.findOne({
                where: { id: parseInt(id) },
                relations: ["criterios", "adjuntos"]
            });

            if (!evaluacion) {
                return handleErrorClient(res, 404, "Evaluación no encontrada.");
            }

            handleSuccess(res, 200, "Evaluación obtenida", evaluacion);
        } catch (error) {
            handleErrorServer(res, 500, "Error al obtener la evaluación", error.message);
        }
    }

    async addCriterio(req, res) {
        try {
            const { evalId } = req.params;
            const { descripcion, puntajeMaximo } = req.body;

            if (!descripcion || puntajeMaximo === undefined) {
                return handleErrorClient(res, 400, "Se requiere 'descripcion' y 'puntajeMaximo'.");
            }

            const evaluacion = await evaluacionRepo.findOneBy({ id: parseInt(evalId) });
            if (!evaluacion) {
                return handleErrorClient(res, 404, "Evaluación no encontrada.");
            }
            const nuevoCriterio = criterioRepo.create({
                descripcion,
                puntajeMaximo,
                evaluacion: evaluacion
            });

            await criterioRepo.save(nuevoCriterio);

            handleSuccess(res, 201, "Criterio añadido a la rúbrica", nuevoCriterio);

        } catch (error) {
            handleErrorServer(res, 500, "Error al añadir criterio", error.message);
        }
    }
}