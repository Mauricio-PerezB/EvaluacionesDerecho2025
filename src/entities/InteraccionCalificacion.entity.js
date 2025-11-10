import { EntitySchema } from "typeorm";

export const InteraccionCalificacionSchema = new EntitySchema({
    name: "InteraccionCalificacion", 
    tableName: "interacciones_calificacion", 
    columns: {
        id: {
            type: "int",
            primary: true,
            generated: "increment",
        },
        contenido: {
            type: "text",
            nullable: false,
        },
        fechaEnvio: {
            name: "fecha_envio",
            type: "timestamp",
            createDate: true,
        },
        tipoInteraccion: {
            name: "tipo_interaccion",
            type: "enum",
            enum: ["INICIAL_ALUMNO", "RESPUESTA_DOCENTE"],
            nullable: false,
        },
        seRealizoCambioNota: {
            name: "se_realizo_cambio_nota",
            type: "boolean",
            default: false,
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
        calificacion: {
            target: "Calificacion",
            type: "many-to-one",
            joinColumn: { name: "calificacion_id" },
            inverseSide: "interacciones",
            nullable: false,
        },
        autor: {
            target: "Usuario",
            type: "many-to-one",
            joinColumn: { name: "autor_id" },
            inverseSide: "interacciones_enviadas",
            nullable: false,
        },
        respuestaA: {
            target: "InteraccionCalificacion",
            type: "many-to-one",
            joinColumn: { name: "respuesta_a_id" },
            nullable: true,
        }
    },
});