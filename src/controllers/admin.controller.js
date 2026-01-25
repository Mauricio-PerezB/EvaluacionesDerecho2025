import { AppDataSource } from "../config/configDb.js";
import { RamoSchema } from "../entities/ramo.entity.js";
import { CalificacionSchema } from "../entities/calificacion.entity.js";
import { handleErrorServer, handleSuccess } from "../Handlers/responseHandlers.js";

export const createRamo = async (req, res) => {
    try {
        const ramoRepo = AppDataSource.getRepository(RamoSchema);
        const nuevoRamo = ramoRepo.create(req.body);
        await ramoRepo.save(nuevoRamo);
        handleSuccess(res, 201, "Ramo creado con éxito", nuevoRamo);
    } catch (error) {
        handleErrorServer(res, 500, "Error al crear ramo", error.message);
    }
};

export const createCalificacionManual = async (req, res) => {
    try {
        const califRepo = AppDataSource.getRepository(CalificacionSchema);
        // Creamos la calificación con la fecha actual para probar las 24 horas
        const nuevaCalif = califRepo.create({
            ...req.body,
            fechaSubida: new Date() 
        });
        await califRepo.save(nuevaCalif);
        handleSuccess(res, 201, "Calificación subida con éxito", nuevaCalif);
    } catch (error) {
        handleErrorServer(res, 500, "Error al subir nota", error.message);
    }
};