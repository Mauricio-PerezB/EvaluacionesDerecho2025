import { EntitySchema } from "typeorm";

export const PreguntaSchema = new EntitySchema({
    name: "Pregunta",
    tableName: "preguntas",
    columns: {
        id: {
            type: "int",
            primary: true,
            generated: "increment"
        },
        pregunta: {
            type: "text",
            nullable: false,
        },
        respuesta: {
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
        profesor: {
            target: "Usuario",
            type: "many-to-one",
            joinColumn: { name: "profesor_id" },
            nullable: true, 
            onDelete: "SET NULL",
        },
        alumno : {
            target: "Usuario",
            type: "many-to-one",
            joinColumn: { name: "alumno_id" },
            nullable: true, 
            onDelete: "SET NULL",
        },
        unidad: {
            target: "Unidad",
            type: "many-to-one",
            joinColumn: { name: "unidad_id" },
            nullable: false,
        },
    },
});          generated: "increment"
  
