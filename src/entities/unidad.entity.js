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
        preguntas: {
            target: "Pregunta",
            type: "one-to-many",
            inverseSide: "unidad",
        },
    },
});
