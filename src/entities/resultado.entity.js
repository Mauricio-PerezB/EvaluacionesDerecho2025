import { EntitySchema } from "typeorm";

export const ResultadoSchema = new EntitySchema({
    name: "Resultado",
    tableName: "resultados",
    columns: {
        id: { type: "int", primary: true, generated: "increment" },
        puntajeObtenido: { name: "puntaje_obtenido", type: "decimal", precision: 5, scale: 2, nullable: false },
        comentario: { type: "text", nullable: true }, 
    },
    relations: {
        entrega: {
            target: "Entrega",
            type: "many-to-one",
            joinColumn: { name: "entrega_id" },
            inverseSide: "resultados",
            onDelete: "CASCADE",
        },
        criterio: {
            target: "Criterio",
            type: "many-to-one", 
            joinColumn: { name: "criterio_id" },
            onDelete: "SET NULL",
        },
    },
});