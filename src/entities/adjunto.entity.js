import { EntitySchema } from "typeorm";

export const AdjuntoSchema = new EntitySchema({
    name: "Adjunto",
    tableName: "adjuntos",
    columns: {
        id: { type: "int", primary: true, generated: "increment" },
        nombreArchivo: { name: "nombre_archivo", type: "varchar" },
        url: { type: "varchar", nullable: false }, 
    },
    relations: {
        evaluacion: {
            target: "Evaluacion",
            type: "many-to-one",
            joinColumn: { name: "evaluacion_id" },
            inverseSide: "adjuntos",
            onDelete: "CASCADE",
        },
    },
});