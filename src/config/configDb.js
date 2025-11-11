"use strict";
import { DataSource } from "typeorm";
import { DATABASE, DB_USERNAME, HOST, PASSWORD, DB_PORT } from "./configEnv.js";

import { UsuarioSchema } from "../entities/usuario.entity.js";
import { RamoSchema } from "../entities/ramo.entity.js";
import { EvaluacionSchema } from "../entities/evaluacion.entity.js";
import { InteraccionCalificacionSchema } from "../entities/InteraccionCalificacion.entity.js";
import { CalificacionSchema } from "../entities/calificacion.entity.js";
import { AdjuntoSchema } from "../entities/adjunto.entity.js";
import { CriterioSchema } from "../entities/criterio.entity.js";
import { EntregaSchema } from "../entities/entrega.entity.js";
import { PreguntaSchema } from "../entities/preguntas.entity.js";
import { ResultadoSchema } from "../entities/resultado.entity.js";
import { UnidadSchema } from "../entities/unidad.entity.js";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: `${HOST}`,
  port: `${DB_PORT}`,
  username: `${DB_USERNAME}`,
  password: `${PASSWORD}`,
  database: `${DATABASE}`,
  
  entities: [
    UsuarioSchema,
    RamoSchema,
    EvaluacionSchema,
    InteraccionCalificacionSchema,
    CalificacionSchema,
    AdjuntoSchema,
    CriterioSchema,
    EntregaSchema,
    PreguntaSchema,
    ResultadoSchema,
    UnidadSchema,
  ],
  
  synchronize: true,
  logging: false,
});

export async function connectDB() {
  try {
    await AppDataSource.initialize();
    console.log("=> Conexión exitosa a la base de datos PostgreSQL!");
  } catch (error) {
    console.error("Error al conectar con la base de datos:", error);
    process.exit(1);
  }
}