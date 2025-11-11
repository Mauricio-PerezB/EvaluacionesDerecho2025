const { DataSource, In } = require("typeorm");


function PreguntaService(dataSource) {
  if (!dataSource || !(dataSource instanceof DataSource)) {
    throw new Error(
      "PreguntaService necesita una instancia válida de TypeORM DataSource"
    );
  }

  const repo = dataSource.getRepository("Pregunta");
  const usuarioRepo = dataSource.getRepository("Usuario");
  const unidadRepo = dataSource.getRepository("Unidad");

  async function createPregunta(payload) {
    const { pregunta, respuesta = null, unidadId, profesorId = null, alumnoId = null } = payload;

    if (!pregunta || !unidadId) {
      throw new Error("Los campos 'pregunta' y 'unidadId' son obligatorios");
    }

    const unidad = await unidadRepo.findOneBy({ id: unidadId });
    if (!unidad) throw new Error("Unidad no encontrada");

    if (profesorId) {
      const prof = await usuarioRepo.findOneBy({ id: profesorId });
      if (!prof) throw new Error("Profesor no encontrado");
    }

    if (alumnoId) {
      const alum = await usuarioRepo.findOneBy({ id: alumnoId });
      if (!alum) throw new Error("Alumno no encontrado");
    }

    const nueva = repo.create({
      pregunta,
      respuesta,
      unidad: { id: unidadId },
      profesor: profesorId ? { id: profesorId } : null,
      alumno: alumnoId ? { id: alumnoId } : null,
    });

    return repo.save(nueva);
  }

  async function createPreguntasBulk(payloads) {
    if (!Array.isArray(payloads) || payloads.length === 0) {
      throw new Error("payloads debe ser un array no vacío");
    }

    return dataSource.transaction(async (manager) => {
      const repoTx = manager.getRepository("Pregunta");
      const unidadIds = [...new Set(payloads.map(p => p.unidadId))];

      const unidades = await manager.getRepository("Unidad").findBy({ id: In(unidadIds) });
      const unidadesEncontradas = unidades.map(u => u.id);
      for (const p of payloads) {
        if (!unidadesEncontradas.includes(p.unidadId)) {
          throw new Error(`Unidad ${p.unidadId} no encontrada`);
        }
      }

      const entities = payloads.map(p =>
        repoTx.create({
          pregunta: p.pregunta,
          respuesta: p.respuesta ?? null,
          unidad: { id: p.unidadId },
          profesor: p.profesorId ? { id: p.profesorId } : null,
          alumno: p.alumnoId ? { id: p.alumnoId } : null,
        })
      );

      return repoTx.save(entities);
    });
  }

  async function getPreguntaById(id, options = {}) {
    if (!id) throw new Error("id es obligatorio");
    return repo.findOne({
      where: { id },
      relations: options.relations ?? ["unidad", "profesor", "alumno"],
    });
  }

  async function listPreguntas(filters = {}) {
    const { unidadId, profesorId, alumnoId, searchText, skip = 0, take = 100 } = filters;
    const where = {};

    if (unidadId) where.unidad = { id: unidadId };
    if (profesorId) where.profesor = { id: profesorId };
    if (alumnoId) where.alumno = { id: alumnoId };

    const qb = repo.createQueryBuilder("p")
      .leftJoinAndSelect("p.unidad", "unidad")
      .leftJoinAndSelect("p.profesor", "profesor")
      .leftJoinAndSelect("p.alumno", "alumno")
      .skip(skip)
      .take(take)
      .orderBy("p.fecha_creacion", "DESC");

    if (unidadId) qb.andWhere("unidad.id = :unidadId", { unidadId });
    if (profesorId) qb.andWhere("profesor.id = :profesorId", { profesorId });
    if (alumnoId) qb.andWhere("alumno.id = :alumnoId", { alumnoId });
    if (searchText) qb.andWhere("p.pregunta ILIKE :q", { q: `%${searchText}%` });

    return qb.getMany();
  }

  async function listByUnidad(unidadId) {
    return listPreguntas({ unidadId });
  }

  async function listByProfesor(profesorId) {
    return listPreguntas({ profesorId });
  }

  async function listByAlumno(alumnoId) {
    return listPreguntas({ alumnoId });
  }

  async function updatePregunta(id, data) {
    if (!id) throw new Error("id es obligatorio");
    const existing = await repo.findOne({ where: { id } });
    if (!existing) throw new Error("Pregunta no encontrada");

    if (data.unidadId) {
      const unidad = await unidadRepo.findOneBy({ id: data.unidadId });
      if (!unidad) throw new Error("Unidad no encontrada");
      existing.unidad = { id: data.unidadId };
    }
    if (data.pregunta !== undefined) existing.pregunta = data.pregunta;
    if (data.respuesta !== undefined) existing.respuesta = data.respuesta;

    return repo.save(existing);
  }

  async function deletePregunta(id) {
    if (!id) throw new Error("id es obligatorio");
    const toDelete = await repo.findOne({ where: { id } });
    if (!toDelete) throw new Error("Pregunta no encontrada");
    return repo.remove(toDelete);
  }

  async function assignToAlumno(preguntaId, alumnoId) {
    if (!preguntaId || !alumnoId) throw new Error("preguntaId y alumnoId son requeridos");
    const alumno = await usuarioRepo.findOneBy({ id: alumnoId });
    if (!alumno) throw new Error("Alumno no encontrado");

    const pregunta = await repo.findOne({ where: { id: preguntaId } });
    if (!pregunta) throw new Error("Pregunta no encontrada");

    pregunta.alumno = { id: alumnoId };
    return repo.save(pregunta);
  }

  async function unassignFromAlumno(preguntaId) {
    if (!preguntaId) throw new Error("preguntaId es requerido");
    const pregunta = await repo.findOne({ where: { id: preguntaId } });
    if (!pregunta) throw new Error("Pregunta no encontrada");
    pregunta.alumno = null;
    return repo.save(pregunta);
  }

  return {
    createPregunta,
    createPreguntasBulk,
    getPreguntaById,
    listPreguntas,
    listByUnidad,
    listByProfesor,
    listByAlumno,
    updatePregunta,
    deletePregunta,
    assignToAlumno,
    unassignFromAlumno,
  };
}

module.exports = PreguntaService;

"use strict";

import { AppDataSource } from "../config/configDb.js";
import Pregunta from "../entity/pregunta.entity.js";
import Usuario from "../entity/usuario.entity.js";
import Unidad from "../entity/unidad.entity.js";

export async function createPreguntaService(body) {
  try {
    const preguntaRepository = AppDataSource.getRepository(Pregunta);
    const usuarioRepository = AppDataSource.getRepository(Usuario);
    const unidadRepository = AppDataSource.getRepository(Unidad);

    const { pregunta, respuesta = null, unidad_id, profesor_id = null, alumno_id = null } = body;

    if (!pregunta || !unidad_id) {
      throw new Error("Los campos 'pregunta' y 'unidad_id' son obligatorios");
    }

    const unidad = await unidadRepository.findOneBy({ id: unidad_id });
    if (!unidad) throw new Error("Unidad no encontrada");

    if (profesor_id) {
      const profesor = await usuarioRepository.findOneBy({ id: profesor_id });
      if (!profesor) throw new Error("Profesor no encontrado");
    }

    if (alumno_id) {
      const alumno = await usuarioRepository.findOneBy({ id: alumno_id });
      if (!alumno) throw new Error("Alumno no encontrado");
    }

    const nuevaPregunta = preguntaRepository.create({
      pregunta,
      respuesta,
      unidad: { id: unidad_id },
      profesor: profesor_id ? { id: profesor_id } : null,
      alumno: alumno_id ? { id: alumno_id } : null,
    });

    await preguntaRepository.save(nuevaPregunta);
    return nuevaPregunta;
  } catch (error) {
    throw new Error("Error al crear la pregunta");
  }
}

export async function getPreguntasService() {
  try {
    const preguntaRepository = AppDataSource.getRepository(Pregunta);
    const preguntas = await preguntaRepository.find({
      relations: ["unidad", "profesor", "alumno"],
      order: { fecha_creacion: "DESC" },
    });
    return preguntas;
  } catch (error) {
    throw new Error("Error al obtener las preguntas");
  }
}

export async function getPreguntaByIdService(id) {
  try {
    const preguntaRepository = AppDataSource.getRepository(Pregunta);
    const pregunta = await preguntaRepository.findOne({
      where: { id },
      relations: ["unidad", "profesor", "alumno"],
    });
    return pregunta;
  } catch (error) {
    throw new Error("Error al obtener la pregunta por ID");
  }
}

export async function updatePreguntaService(id, body) {
  try {
    const preguntaRepository = AppDataSource.getRepository(Pregunta);
    const unidadRepository = AppDataSource.getRepository(Unidad);

    let pregunta = await preguntaRepository.findOne({
      where: { id },
      relations: ["unidad"],
    });

    if (!pregunta) return [null, "Pregunta no encontrada"];

    if (body.unidad_id) {
      const unidad = await unidadRepository.findOneBy({ id: body.unidad_id });
      if (!unidad) return [null, "Unidad no encontrada"];
      pregunta.unidad = { id: body.unidad_id };
    }

    pregunta = { ...pregunta, ...body };

    await preguntaRepository.save(pregunta);
    return [pregunta, null];
  } catch (error) {
    return [null, "Error al actualizar la pregunta"];
  }
}

export async function deletePreguntaService(id) {
  try {
    const preguntaRepository = AppDataSource.getRepository(Pregunta);
    const pregunta = await preguntaRepository.findOneBy({ id });
    if (!pregunta) return [null, "Pregunta no encontrada"];

    await preguntaRepository.remove(pregunta);
    return [pregunta, null];
  } catch (error) {
    return [null, "Error al eliminar la pregunta"];
  }
}

export async function getPreguntasByUnidadService(unidadId) {
  try {
    const preguntaRepository = AppDataSource.getRepository(Pregunta);
    const preguntas = await preguntaRepository.find({
      where: { unidad: { id: unidadId } },
      relations: ["unidad", "profesor", "alumno"],
    });
    return preguntas;
  } catch (error) {
    throw new Error("Error al obtener las preguntas por unidad");
  }
}

export async function getPreguntasByProfesorService(profesorId) {
  try {
    const preguntaRepository = AppDataSource.getRepository(Pregunta);
    const preguntas = await preguntaRepository.find({
      where: { profesor: { id: profesorId } },
      relations: ["unidad", "profesor", "alumno"],
    });
    return preguntas;
  } catch (error) {
    throw new Error("Error al obtener las preguntas por profesor");
  }
}

export async function getPreguntasByAlumnoService(alumnoId) {
  try {
    const preguntaRepository = AppDataSource.getRepository(Pregunta);
    const preguntas = await preguntaRepository.find({
      where: { alumno: { id: alumnoId } },
      relations: ["unidad", "profesor", "alumno"],
    });
    return preguntas;
  } catch (error) {
    throw new Error("Error al obtener las preguntas por alumno");
  }
}

export async function assignPreguntaToAlumnoService(preguntaId, alumnoId) {
  try {
    const preguntaRepository = AppDataSource.getRepository(Pregunta);
    const usuarioRepository = AppDataSource.getRepository(Usuario);

    const alumno = await usuarioRepository.findOneBy({ id: alumnoId });
    if (!alumno) throw new Error("Alumno no encontrado");

    const pregunta = await preguntaRepository.findOneBy({ id: preguntaId });
    if (!pregunta) throw new Error("Pregunta no encontrada");

    pregunta.alumno = { id: alumnoId };
    await preguntaRepository.save(pregunta);
    return pregunta;
  } catch (error) {
    throw new Error("Error al asignar la pregunta al alumno");
  }
}

export async function unassignPreguntaFromAlumnoService(preguntaId) {
  try {
    const preguntaRepository = AppDataSource.getRepository(Pregunta);
    const pregunta = await preguntaRepository.findOneBy({ id: preguntaId });
    if (!pregunta) throw new Error("Pregunta no encontrada");

    pregunta.alumno = null;
    await preguntaRepository.save(pregunta);
    return pregunta;
  } catch (error) {
    throw new Error("Error al desasignar la pregunta del alumno");
  }
}