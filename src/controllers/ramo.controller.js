// controllers/ramo.controller.js

import { AppDataSource } from "../data-source";
import { RamoSchema } from "../entities/ramo.entity";
import { handleSuccess, handleErrorClient, handleErrorServer } from "../Handlers/responseHandlers.js";

const RamoRepository = AppDataSource.getRepository(RamoSchema);

export class RamoController {
    
    async getAllRamos(req, res) {
        try {
            const ramos = await RamoRepository.find();
            handleSuccess(res, 200, "Ramos obtenidos exitosamente", ramos);
        } catch (error) {
            handleErrorServer(res, 500, "Error al obtener los ramos", error.message);
        }
    }

    async getRamoById(req, res) {
        try {
            const { id } = req.params;
            
            if (!id || isNaN(id)) {
                return handleErrorClient(res, 400, "ID de Ramo inválido.");
            }
            
            const ramo = await RamoRepository.findOne({ where: { id: parseInt(id) } });

            if (!ramo) {
                return handleErrorClient(res, 404, `Ramo con ID ${id} no encontrado.`);
            }
            
            handleSuccess(res, 200, "Ramo obtenido exitosamente", ramo);
        } catch (error) {
            handleErrorServer(res, 500, "Error al obtener el ramo", error.message);
        }
    }

    async createRamo(req, res) {
        try {
            const data = req.body;
            
            if (!data.nombre || !data.codigo) {
                return handleErrorClient(res, 400, "Nombre y código son requeridos para el ramo");
            }
            
            const nuevoRamo = RamoRepository.create(data);
            await RamoRepository.save(nuevoRamo);
            
            handleSuccess(res, 201, "Ramo creado exitosamente", nuevoRamo);
        } catch (error) {
            if (error.code === '23505' || error.message.includes('unique')) {
                 return handleErrorClient(res, 409, "El código del ramo ya existe.");
            }
            handleErrorServer(res, 500, "Error al crear el ramo", error.message);
        }
    }
    
    async updateRamo(req, res) {
        try {
            const { id } = req.params;
            const changes = req.body;
            
            if (!id || isNaN(id)) {
                return handleErrorClient(res, 400, "ID de Ramo inválido.");
            }

            if (!changes || Object.keys(changes).length === 0) {
                return handleErrorClient(res, 400, "Datos para actualizar son requeridos.");
            }
            
            const ramoToUpdate = await RamoRepository.findOne({ where: { id: parseInt(id) } });
            
            if (!ramoToUpdate) {
                return handleErrorClient(res, 404, `Ramo con ID ${id} no encontrado.`);
            }

            RamoRepository.merge(ramoToUpdate, changes);
            const ramoActualizado = await RamoRepository.save(ramoToUpdate);
            
            handleSuccess(res, 200, "Ramo actualizado exitosamente", ramoActualizado);
        } catch (error) {
            if (error.code === '23505' || error.message.includes('unique')) {
                 return handleErrorClient(res, 409, "El nuevo código del ramo ya está en uso.");
            }
            handleErrorServer(res, 500, "Error al actualizar el ramo", error.message);
        }
    }
    
    async deleteRamo(req, res) {
        try {
            const { id } = req.params;
            
            if (!id || isNaN(id)) {
                return handleErrorClient(res, 400, "ID de Ramo inválido.");
            }
            
            const deleteResult = await RamoRepository.delete(parseInt(id));
            
            if (deleteResult.affected === 0) {
                return handleErrorClient(res, 404, `Ramo con ID ${id} no encontrado.`);
            }
            
            handleSuccess(res, 200, "Ramo eliminado exitosamente", { id: parseInt(id) });
        } catch (error) {
            if (error.code === '23503' || error.message.includes('foreign key')) { 
                return handleErrorClient(res, 409, "No se puede eliminar el ramo porque tiene evaluaciones o datos asociados.");
            }
            handleErrorServer(res, 500, "Error al eliminar el ramo", error.message);
        }
    }
}