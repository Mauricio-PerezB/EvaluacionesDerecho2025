import { EntitySchema } from "typeorm";

export const InteraccionCalificacionSchema = new EntitySchema({
    name: "InteraccionCalificacion",
    tableName: "interacciones_calificacion",
    columns: {
        id: { type: "int", primary: true, generated: "increment" },
        contenido: { type: "text", nullable: false },
        tipoInteraccion: { 
            name: "tipo_interaccion", 
            type: "enum", 
            enum: ["INICIAL_ALUMNO", "RESPUESTA_DOCENTE"], 
            nullable: false 
        },
        fechaEnvio: { name: "fecha_envio", type: "timestamp", createDate: true },
    },
    relations: {
        calificacion: {
            target: "Calificacion",
            type: "many-to-one",
            joinColumn: { name: "calificacion_id" },
            inverseSide: "interacciones",
            onDelete: "CASCADE",
        },
        autor: {
            target: "Usuario",
            type: "many-to-one",
            joinColumn: { name: "autor_id" },
        }
    },
});