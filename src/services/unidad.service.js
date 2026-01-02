import { AppDataSource } from "../config/configDb.js";
import { UnidadSchema } from "../entities/unidad.entity.js";

const unidadRepository = AppDataSource.getRepository(UnidadSchema);

export async function findAll() {
  return await unidadRepository.find({
    select: {
        id: true,
        nombre: true,
        descripcion: true
    }
  });
}