import { AppDataSource } from "../config/configDb.js";
import { handleErrorClient, handleErrorServer, handleSuccess } from "../Handlers/responseHandlers.js";

import { EntregaSchema } from "../entities/entrega.entity.js";
import { ResultadoSchema } from "../entities/resultado.entity.js";
import { CalificacionSchema } from "../entities/calificacion.entity.js";
import { EvaluacionSchema } from "../entities/evaluacion.entity.js";
import { UsuarioSchema } from "../entities/usuario.entity.js";
import { CriterioSchema } from "../entities/criterio.entity.js";

const entregaRepo = AppDataSource.getRepository(EntregaSchema);
const resultadoRepo = AppDataSource.getRepository(ResultadoSchema);
const calificacionRepo = AppDataSource.getRepository(CalificacionSchema);
const evaluacionRepo = AppDataSource.getRepository(EvaluacionSchema);
const usuarioRepo = AppDataSource.getRepository(UsuarioSchema);
const criterioRepo = AppDataSource.getRepository(CriterioSchema);

export class EntregaController {

    async createEntrega(req, res) {
        try {
            const { evaluacionId, alumnoId, comentarioGeneral, resultados } = req.body;

            if (!evaluacionId || !alumnoId || !resultados || !Array.isArray(resultados)) {
                return handleErrorClient(res, 400, "Faltan datos clave (evaluacionId, alumnoId, resultados).");
            }

            if (resultados.length === 0) {
                return handleErrorClient(res, 400, "Debe proporcionar al menos un resultado.");
            }

            const result = await AppDataSource.transaction(async (transactionManager) => {
                const evaluacion = await transactionManager.findOne(EvaluacionSchema, { 
                    where: { id: evaluacionId },
                    relations: ['criterios']
                });
                
                const alumno = await transactionManager.findOne(UsuarioSchema, { 
                    where: { id: alumnoId } 
                });

                if (!evaluacion) {
                    throw new Error("Evaluación no encontrada.");
                }
                if (!alumno) {
                    throw new Error("Alumno no encontrado.");
                }

                if (alumno.rol !== 'ALUMNO') {
                    throw new Error("El usuario especificado no es un alumno.");
                }

                const criteriosIds = resultados.map(r => r.criterioId);
                const criterios = await transactionManager.find(CriterioSchema, {
                    where: criteriosIds.map(id => ({ id }))
                });

                if (criterios.length !== criteriosIds.length) {
                    throw new Error("Uno o más criterios no existen.");
                }

                const criteriosEvaluacion = evaluacion.criterios.map(c => c.id);
                for (const criterioId of criteriosIds) {
                    if (!criteriosEvaluacion.includes(criterioId)) {
                        throw new Error(`El criterio ${criterioId} no pertenece a esta evaluación.`);
                    }
                }

                const entregaExistente = await transactionManager.findOne(EntregaSchema, {
                    where: {
                        alumno: { id: alumnoId },
                        evaluacion: { id: evaluacionId }
                    }
                });

                if (entregaExistente) {
                    throw new Error("Ya existe una calificación para este alumno en esta evaluación.");
                }

                let puntajeTotal = 0;
                for (const resData of resultados) {
                    const criterio = criterios.find(c => c.id === resData.criterioId);
                    const puntaje = parseFloat(resData.puntajeObtenido || 0);
                    
                    if (puntaje < 0) {
                        throw new Error(`El puntaje no puede ser negativo para el criterio ${resData.criterioId}.`);
                    }
                    
                    if (puntaje > criterio.puntajeMaximo) {
                        throw new Error(`El puntaje ${puntaje} excede el máximo ${criterio.puntajeMaximo} para el criterio ${resData.criterioId}.`);
                    }
                    
                    puntajeTotal += puntaje;
                }

                console.log("Puntaje total calculado:", puntajeTotal);

                const nuevaEntrega = transactionManager.create(EntregaSchema, {
                    evaluacion: evaluacion,
                    alumno: alumno,
                    puntajeTotal: puntajeTotal,
                    comentarioGeneral: comentarioGeneral || null
                });
                await transactionManager.save(EntregaSchema, nuevaEntrega);

                const resultadosAGuardar = [];
                for (const resData of resultados) {
                    const resultado = transactionManager.create(ResultadoSchema, {
                        entrega: nuevaEntrega,
                        criterio: { id: resData.criterioId },
                        puntajeObtenido: parseFloat(resData.puntajeObtenido),
                        comentario: resData.comentario || null
                    });
                    resultadosAGuardar.push(resultado);
                }
                await transactionManager.save(ResultadoSchema, resultadosAGuardar);

                const nuevaCalificacion = transactionManager.create(CalificacionSchema, {
                    nota: parseFloat(puntajeTotal),
                    retroalimentacionDocente: comentarioGeneral || null,
                    entrega: nuevaEntrega
                });
                
                console.log("Calificación a guardar:", nuevaCalificacion);
                
                await transactionManager.save(CalificacionSchema, nuevaCalificacion);

                const entregaCompleta = await transactionManager.findOne(EntregaSchema, {
                    where: { id: nuevaEntrega.id },
                    relations: ['evaluacion', 'alumno', 'resultados', 'resultados.criterio', 'calificacion']
                });

                return entregaCompleta;
            });

            handleSuccess(res, 201, "Calificación con rúbrica guardada exitosamente", result);

        } catch (error) {
            console.error("Error en createEntrega:", error);
            
            if (error.message.includes("no encontrad") || 
                error.message.includes("no existe") || 
                error.message.includes("Ya existe") ||
                error.message.includes("no pertenece") ||
                error.message.includes("no es un alumno") ||
                error.message.includes("excede el máximo") ||
                error.message.includes("no puede ser negativo")) {
                return handleErrorClient(res, 400, error.message);
            }
            
            handleErrorServer(res, 500, "Error al guardar la calificación", error.message);
        }
    }

    async getMiEntrega(req, res) {
        try {
            const alumnoId = req.user.id;
            const { evalId } = req.params;

            if (!evalId) {
                return handleErrorClient(res, 400, "El parámetro evalId es requerido.");
            }

            const evaluacionId = parseInt(evalId);
            if (isNaN(evaluacionId)) {
                return handleErrorClient(res, 400, "El evalId debe ser un número válido.");
            }

            const entrega = await entregaRepo.findOne({
                where: {
                    alumno: { id: alumnoId },
                    evaluacion: { id: evaluacionId }
                },
                relations: [
                    "evaluacion",
                    "alumno",
                    "calificacion",
                    "resultados",
                    "resultados.criterio"
                ]
            });

            if (!entrega) {
                return handleErrorClient(res, 404, "Aún no tienes calificación para esta evaluación.");
            }

            if (entrega.alumno && entrega.alumno.password) {
                delete entrega.alumno.password;
            }

            handleSuccess(res, 200, "Calificación obtenida", entrega);

        } catch (error) {
            console.error("Error en getMiEntrega:", error);
            handleErrorServer(res, 500, "Error al obtener tu calificación", error.message);
        }
    }

    async getEntregasByEvaluacion(req, res) {
        try {
            const { evalId } = req.params;

            if (!evalId) {
                return handleErrorClient(res, 400, "El parámetro evalId es requerido.");
            }

            const evaluacionId = parseInt(evalId);
            if (isNaN(evaluacionId)) {
                return handleErrorClient(res, 400, "El evalId debe ser un número válido.");
            }

            const entregas = await entregaRepo.find({
                where: {
                    evaluacion: { id: evaluacionId }
                },
                relations: [
                    "alumno",
                    "calificacion",
                    "resultados",
                    "resultados.criterio"
                ],
                order: {
                    alumno: {
                        apellido: "ASC",
                        nombre: "ASC"
                    }
                }
            });

            entregas.forEach(entrega => {
                if (entrega.alumno && entrega.alumno.password) {
                    delete entrega.alumno.password;
                }
            });

            handleSuccess(res, 200, "Entregas obtenidas", entregas);

        } catch (error) {
            console.error("Error en getEntregasByEvaluacion:", error);
            handleErrorServer(res, 500, "Error al obtener las entregas", error.message);
        }
    }
}