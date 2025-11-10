import { EntitySchema } from "typeorm";

export const RamoSchema = new EntitySchema({
    name: "Ramo", 
    tableName: "ramos", 
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
        codigo: {
            type: "varchar",
            unique: true,
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
});