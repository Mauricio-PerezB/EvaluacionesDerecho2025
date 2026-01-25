import { AppDataSource } from "../config/configDb.js";
import { UnidadSchema } from "../entities/unidad.entity.js";

const unidadRepository = AppDataSource.getRepository(UnidadSchema);

export async function findAll() {
  return await unidadRepository
    .createQueryBuilder("unidad")
    .loadRelationCountAndMap(
      "unidad.cantidadPreguntas",
      "unidad.preguntas"
    )
    .select([
      "unidad.id",
      "unidad.nombre",
      "unidad.descripcion"
    ])
    .getMany();
}