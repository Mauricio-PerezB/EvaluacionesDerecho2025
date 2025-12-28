import { EntitySchema } from "typeorm";

export const CriterioSchema = new EntitySchema({
    name: "Criterio",
    tableName: "criterios",
    columns: {
        id: { type: "int", primary: true, generated: "increment" },
        descripcion: { type: "text", nullable: false },
        puntajeMaximo: { name: "puntaje_maximo", type: "int", nullable: false },
    },
    relations: {
        evaluacion: {
            target: "Evaluacion",
            type: "many-to-one",
            joinColumn: { name: "evaluacion_id" },
            inverseSide: "criterios",
            onDelete: "CASCADE",
        },
        resultados: { 
            target: "Resultado",
            type: "one-to-many",
            inverseSide: "criterio",
        },
    },
});