import { EntitySchema } from "typeorm";

export const CalificacionSchema = new EntitySchema({
    name: "Calificacion", 
    tableName: "calificaciones", 
    columns: {
        id: {
            type: "int",
            primary: true,
            generated: "increment",
        },
        nota: {
            type: "decimal",
            precision: 4,
            scale: 2,
            nullable: false,
        },
        retroalimentacionDocente: {
            name: "retroalimentacion_docente",
            type: "text",
            nullable: true,
        },
        fechaSubida: {
            name: "fecha_subida",
            type: "timestamp",
            createDate: true,
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
        entrega: {
            target: "Entrega",
            type: "one-to-one",
            joinColumn: { name: "entrega_id" },
            inverseSide: "calificacion",
        },
        interacciones: {
            target: "InteraccionCalificacion",
            type: "one-to-many",
            inverseSide: "calificacion",
        },
    },
});