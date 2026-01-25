import { AppDataSource } from "../config/configDb.js";
import { PreguntaSchema } from "../entities/preguntas.entity.js";

const preguntaRepository = AppDataSource.getRepository(PreguntaSchema);

export async function findAll() {
  return await preguntaRepository.find({
    relations: ["unidad"],
    select: {
      id: true,
      pregunta: true,
      respuesta: true,
      unidad: {
        id: true,
        nombre: true
      }
    }
  });
}

export async function findById(preguntaId) {
  return await preguntaRepository.findOne({
    where: { id: preguntaId },
  });
}

export async function findByUnitId(unidadId) {
  return await preguntaRepository.find({
    relations: ["unidad"],
    where: { unidad: { id: unidadId } },
    select: {
      id: true,
      pregunta: true,
      respuesta: true,
      unidad: {
        id: true,
        nombre: true
      }
    }
  });
}

export async function create(data) {
  const nuevaPregunta = preguntaRepository.create({
    pregunta: data.pregunta,
    respuesta: data.respuesta,
    unidad: data.unidad_id ? { id: data.unidad_id } : null
  });

  return await preguntaRepository.save(nuevaPregunta);
}

export async function update(preguntaId, data) {
  const pregunta = await preguntaRepository.findOne({
    where: { id: preguntaId },
  });

  if (!pregunta) {
    throw new Error(`Pregunta con id ${preguntaId} no encontrada.`);
  }

  pregunta.pregunta = data.pregunta ?? pregunta.pregunta;
  pregunta.respuesta = data.respuesta ?? pregunta.respuesta;

  if (data.unidad_id !== undefined) {
    pregunta.unidad = data.unidad_id ? { id: data.unidad_id } : null;
  }

  return await preguntaRepository.save(pregunta);
}

export async function remove(preguntaId) {
  const pregunta = await preguntaRepository.findOne({ where: { id: preguntaId } });
  if (!pregunta) throw new Error(`Pregunta con id ${preguntaId} no encontrada.`);

  await preguntaRepository.delete({ id: preguntaId });
  return { id: preguntaId };
}