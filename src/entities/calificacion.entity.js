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
            nullable: true, // Opcional, ya que puede ser que no siempre haya retroalimentación
        },
        fechaSubida: {
            name: "fecha_subida",
            type: "timestamp",
            createDate: true, // Esta será la fecha que activa el plazo de 24h
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
        alumno: {
            target: "Usuario",
            type: "many-to-one",
            joinColumn: { name: "alumno_id" },
            inverseSide: "calificaciones_obtenidas",
            nullable: false,
        },
        evaluacion: {
            target: "Evaluacion",
            type: "many-to-one",
            joinColumn: { name: "evaluacion_id" },
            inverseSide: "calificaciones",
            nullable: false,
        },
        interacciones: {
            target: "InteraccionCalificacion",
            type: "one-to-many",
            inverseSide: "calificacion",
        },
    },
});