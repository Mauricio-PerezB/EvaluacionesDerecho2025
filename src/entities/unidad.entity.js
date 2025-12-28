import { EntitySchema } from "typeorm";

export const UnidadSchema = new EntitySchema({
    name: "Unidad",
    tableName: "unidades",
    columns: {
        id: {
            type: "int",
            primary: true,
            generated: "increment",
        },
        nombre: {
            type: "varchar",
            length: 255,
            nullable: false,
        },
        descripcion: {
            type: "text",
            nullable: true,
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
        preguntas: {
            target: "Pregunta",
            type: "one-to-many",
            inverseSide: "unidad",
        },
    },
});
