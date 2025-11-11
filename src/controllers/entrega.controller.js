import { AppDataSource } from "../config/configDb.js";
import { handleErrorClient, handleErrorServer, handleSuccess } from "../Handlers/responseHandlers.js";

import { EntregaSchema } from "../entities/entrega.entity.js";
import { ResultadoSchema } from "../entities/resultado.entity.js";
import { CalificacionSchema } from "../entities/calificacion.entity.js";
import { EvaluacionSchema } from "../entities/evaluacion.entity.js";
import { UsuarioSchema } from "../entities/usuario.entity.js";

const entregaRepo = AppDataSource.getRepository(EntregaSchema);
const resultadoRepo = AppDataSource.getRepository(ResultadoSchema);
const calificacionRepo = AppDataSource.getRepository(CalificacionSchema);
const evaluacionRepo = AppDataSource.getRepository(EvaluacionSchema);
const usuarioRepo = AppDataSource.getRepository(UsuarioSchema);

export class EntregaController {

    async createEntrega(req, res) {
        const { evaluacionId, alumnoId, comentarioGeneral, resultados } = req.body;

        if (!evaluacionId || !alumnoId || !resultados || !Array.isArray(resultados)) {
            return handleErrorClient(res, 400, "Faltan datos clave (evaluacionId, alumnoId, resultados).");
        }

        await AppDataSource.transaction(async (transactionManager) => {
            try {
                const evaluacion = await transactionManager.findOneBy(EvaluacionSchema, { id: evaluacionId });
                const alumno = await transactionManager.findOneBy(UsuarioSchema, { id: alumnoId });
                if (!evaluacion || !alumno) {
                    throw new Error("Evaluación o Alumno no encontrado.");
                }

                let puntajeTotal = 0;
                for (const resData of resultados) {
                    puntajeTotal += parseFloat(resData.puntajeObtenido || 0);
                }

                const nuevaEntrega = transactionManager.create(EntregaSchema, {
                    evaluacion: evaluacion,
                    alumno: alumno,
                    puntajeTotal: puntajeTotal,
                    comentarioGeneral: comentarioGeneral
                });
                await transactionManager.save(nuevaEntrega);

                const resultadosAGuardar = resultados.map(resData => {
                    return transactionManager.create(ResultadoSchema, {
                        entrega: nuevaEntrega,
                        criterio: { id: resData.criterioId },
                        puntajeObtenido: resData.puntajeObtenido,
                        comentario: resData.comentario
                    });
                });
                await transactionManager.save(resultadosAGuardar);

                const nuevaCalificacion = transactionManager.create(CalificacionSchema, {
                    nota: puntajeTotal,
                    retroalimentacionDocente: comentarioGeneral,
                    entrega: nuevaEntrega
                });
                await transactionManager.save(nuevaCalificacion);


                handleSuccess(res, 201, "Calificación con rúbrica guardada exitosamente", nuevaEntrega);

            } catch (error) {
                handleErrorServer(res, 500, "Error al guardar la calificación", error.message);
            }
        });
    }

    async getMiEntrega(req, res) {
        try {
            const alumnoId = req.user.id; //
            const { evalId } = req.params;

            const entrega = await entregaRepo.findOne({
                where: {
                    alumno: { id: alumnoId },
                    evaluacion: { id: parseInt(evalId) }
                },
                relations: [
                    "evaluacion",
                    "calificacion",
                    "resultados",
                    "resultados.criterio"
                ]
            });

            if (!entrega) {
                return handleErrorClient(res, 404, "Aún no tienes calificación para esta evaluación.");
            }

            handleSuccess(res, 200, "Calificación obtenida", entrega);

        } catch (error) {
            handleErrorServer(res, 500, "Error al obtener tu calificación", error.message);
        }
    }
}