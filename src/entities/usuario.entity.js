import { EntitySchema } from "typeorm";

export const UsuarioSchema = new EntitySchema({
    name: "Usuario", 
    
    tableName: "usuarios", 
    
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
        apellido: {
            type: "varchar",
            nullable: false,
        },
        rut: {
            type: "varchar",
            unique: true,
            nullable: false,
        },
        email: {
            type: "varchar",
            unique: true,
            nullable: false,
        },
        password: {
            name: "password",
            type: "varchar",
            nullable: false,
            select: false,
        },
        rol: {
            type: "enum",
            enum: ["ALUMNO", "PROFESOR"],
            default: "ALUMNO",
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