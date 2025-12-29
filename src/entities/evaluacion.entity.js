import { EntitySchema } from "typeorm";

export const EvaluacionSchema = new EntitySchema({
    name: "Evaluacion",
    tableName: "evaluaciones",
    columns: {
        id: {
            type: "int",
            primary: true,
            generated: "increment",
        },
        nombre: {
            type: "varchar",
            nullable: false,
        },
        fechaRealizacion: {
            name: "fecha_realizacion",
            type: "timestamp",
            nullable: false,
        },
        porcentajeRamo: {
            name: "porcentaje_ramo",
            type: "decimal",
            precision: 5,
            scale: 2,
            nullable: false,
        }
    },
    relations: {
        ramo: {
            target: "Ramo",
            type: "many-to-one",
            joinColumn: { name: "ramo_id" },
            inverseSide: "evaluaciones",
<<<<<<< Updated upstream
            nullable: false,
        },
    },
    calificaciones: {
            target: "Calificacion",
            type: "one-to-many",
            inverseSide: "evaluacion",
        },
=======
        }
        // ... otras relaciones como criterios
    }
>>>>>>> Stashed changes
});