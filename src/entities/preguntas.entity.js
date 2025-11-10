import { EntitySchema } from "typeorm";

export const PreguntaSchema = new EntitySchema({
    name: "Pregunta",
    tableName: "preguntas",
    columns: {
        id: {
            type: "int",
            primary: true,
            generated: "increment",
        },
        pregunta: {
            type: "text",
            nullable: false,
        },
        respuesta: {
            type: "text",
            nullable: true, // puede ser null si la respuesta aún no está definida
        },
        fechaCreacion: {
            name: "fecha_creacion",
            type: "timestamp",
            createDate: true,
        },
        fechaActualizacion: {
            name: "fecha_actualizacion",
            type: "timestamp",
            updateDate: true,
        },
    },
    relations: {
        unidad: {
            target: "Unidad",
            type: "many-to-one",
            joinColumn: { name: "unidad_id" },
            nullable: false,
        },
    },
});
