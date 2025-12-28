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
            nullable: false,
        },
        createdAt: {
            name: "created_at",
            type: "timestamp",
            createDate: true,
        },
        updatedAt: {
            name: "updated_at",
            type: "timestamp",
            updateDate: true,
        },
    },
    relations: {
        unidad: {
            target: "Unidad",
            type: "many-to-one",
            joinColumn: { name: "unidad_id" },
            nullable: true
        },
    },
});
