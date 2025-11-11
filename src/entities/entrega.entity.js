import { EntitySchema } from "typeorm";

export const EntregaSchema = new EntitySchema({
    name: "Entrega",
    tableName: "entregas",
    columns: {
        id: { 
            type: "int", 
            primary: true, 
            generated: "increment" 
        },
        puntajeTotal: { 
            name: "puntaje_total", 
            type: "decimal", 
            precision: 5, 
            scale: 2, 
            nullable: true 
        },
        comentarioGeneral: { 
            name: "comentario_general", 
            type: "text", 
            nullable: true 
        },
    },
    relations: {
        evaluacion: {
            target: "Evaluacion",
            type: "many-to-one",
            joinColumn: { name: "evaluacion_id" },
            inverseSide: "entregas",
        },
        alumno: {
            target: "Usuario",
            type: "many-to-one",
            joinColumn: { name: "alumno_id" },
        },
        resultados: {
            target: "Resultado",
            type: "one-to-many",
            inverseSide: "entrega",
        },
        calificacion: {
            target: "Calificacion",
            type: "one-to-one",
            inverseSide: "entrega",
        },
    },
});