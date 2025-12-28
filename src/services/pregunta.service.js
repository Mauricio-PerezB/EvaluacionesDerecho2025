import { AppDataSource } from "../config/configDb.js";
import { PreguntaSchema } from "../entities/preguntas.entity.js";

const preguntaRepository = AppDataSource.getRepository(PreguntaSchema);

export async function findAll() {
    return await preguntaRepository.find({
        select: {
            id: true,
            pregunta: true
        }
    });
}

export async function findById(preguntaId) {
  return await preguntaRepository.findOne({
    where: { id: preguntaId },
  });
}

export async function create(data) {
  const nuevaPregunta = preguntaRepository.create({
    pregunta: data.pregunta,
    respuesta: data.respuesta,
    unidad_id: data.unidad_id ?? null, // por defecto null
  });

  return await preguntaRepository.save(nuevaPregunta);
}

export async function update(preguntaId, data) {
  const pregunta = await preguntaRepository.findOne({ where: { id: preguntaId } });

  if (!pregunta) {
    throw new Error(`Pregunta con id ${preguntaId} no encontrada.`);
  }

  pregunta.pregunta = data.pregunta ?? pregunta.pregunta;
  pregunta.respuesta = data.respuesta ?? pregunta.respuesta;
  pregunta.unidad_id = data.unidad_id ?? pregunta.unidad_id;

  return await preguntaRepository.save(pregunta);
}

export async function remove(preguntaId) {
  const pregunta = await preguntaRepository.findOne({ where: { id: preguntaId } });
  if (!pregunta) throw new Error(`Pregunta con id ${preguntaId} no encontrada.`);

  await preguntaRepository.delete({ id: preguntaId });
  return { id: preguntaId };
}