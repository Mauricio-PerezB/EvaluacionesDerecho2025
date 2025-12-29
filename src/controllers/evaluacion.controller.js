import { AppDataSource } from "../config/configDb.js";
import { EvaluacionSchema } from "../entities/evaluacion.entity.js";
import { CriterioSchema } from "../entities/criterio.entity.js";
import { handleErrorClient, handleErrorServer, handleSuccess } from "../Handlers/responseHandlers.js";

const evaluacionRepo = AppDataSource.getRepository(EvaluacionSchema);
const criterioRepo = AppDataSource.getRepository(CriterioSchema);

export class EvaluacionController {

    async createEvaluacion(req, res) {
        try {
            const { nombre, fechaRealizacion, porcentajeRamo, ramoId } = req.body;

            if (!nombre || !fechaRealizacion || porcentajeRamo === undefined) {
                return handleErrorClient(res, 400, "Faltan datos requeridos: nombre, fechaRealizacion, porcentajeRamo");
            }

            const nuevaEvaluacion = evaluacionRepo.create({
                nombre,
                fechaRealizacion: new Date(fechaRealizacion),
                porcentajeRamo: parseFloat(porcentajeRamo),
                ramo: ramoId ? { id: ramoId } : null
            });

            await evaluacionRepo.save(nuevaEvaluacion);

            handleSuccess(res, 201, "Evaluación creada exitosamente", nuevaEvaluacion);

        } catch (error) {
            console.error("Error en createEvaluacion:", error);
            handleErrorServer(res, 500, "Error al crear la evaluación", error.message);
        }
    }

    async getEvaluacionDetalle(req, res) {
        try {
            const { id } = req.params;
            
            if (!id) {
                return handleErrorClient(res, 400, "El parámetro id es requerido.");
            }

            const evaluacionId = parseInt(id);
            if (isNaN(evaluacionId)) {
                return handleErrorClient(res, 400, "El id debe ser un número válido.");
            }

            const evaluacion = await evaluacionRepo.findOne({
                where: { id: evaluacionId },
                relations: ["criterios", "adjuntos"]
            });

            if (!evaluacion) {
                return handleErrorClient(res, 404, "Evaluación no encontrada.");
            }

            handleSuccess(res, 200, "Evaluación obtenida", evaluacion);
        } catch (error) {
            console.error("Error en getEvaluacionDetalle:", error);
            handleErrorServer(res, 500, "Error al obtener la evaluación", error.message);
        }
    }

    async addCriterio(req, res) {
        try {
            const { evalId } = req.params;
            const { descripcion, puntajeMaximo } = req.body;

            if (!evalId) {
                return handleErrorClient(res, 400, "El parámetro evalId es requerido.");
            }

            if (!descripcion || puntajeMaximo === undefined) {
                return handleErrorClient(res, 400, "Se requiere 'descripcion' y 'puntajeMaximo'.");
            }

            const puntaje = parseFloat(puntajeMaximo);
            if (isNaN(puntaje) || puntaje <= 0) {
                return handleErrorClient(res, 400, "El puntajeMaximo debe ser un número mayor a 0.");
            }

            const evaluacionId = parseInt(evalId);
            if (isNaN(evaluacionId)) {
                return handleErrorClient(res, 400, "El evalId debe ser un número válido.");
            }

            const evaluacion = await evaluacionRepo.findOne({ 
                where: { id: evaluacionId } 
            });
            
            if (!evaluacion) {
                return handleErrorClient(res, 404, "Evaluación no encontrada.");
            }

            const nuevoCriterio = criterioRepo.create({
                descripcion,
                puntajeMaximo: puntaje,
                evaluacion: evaluacion
            });

            await criterioRepo.save(nuevoCriterio);

            handleSuccess(res, 201, "Criterio añadido a la rúbrica", nuevoCriterio);

        } catch (error) {
            console.error("Error en addCriterio:", error);
            handleErrorServer(res, 500, "Error al añadir criterio", error.message);
        }
    }

    async getAllEvaluaciones(req, res) {
        try {
            const evaluaciones = await evaluacionRepo.find({
                relations: ["criterios"],
                order: {
                    createdAt: "DESC"
                }
            });

            handleSuccess(res, 200, "Evaluaciones obtenidas", evaluaciones);

        } catch (error) {
            console.error("Error en getAllEvaluaciones:", error);
            handleErrorServer(res, 500, "Error al obtener evaluaciones", error.message);
        }
    }
}