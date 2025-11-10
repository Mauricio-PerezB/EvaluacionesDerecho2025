import { handleSuccess } from "../Handlers/responseHandlers.js";
import { updateProfile, deleteProfile } from "../services/user.service.js";
import { handleErrorClient, handleErrorServer } from "../Handlers/responseHandlers.js";

export function getPublicProfile(req, res) {
  handleSuccess(res, 200, "Perfil público obtenido exitosamente", {
    message: "¡Hola! Este es un perfil público. Cualquiera puede verlo.",
  });
}

export function getPrivateProfile(req, res) {
  const user = req.user;
  handleSuccess(res, 200, "Perfil privado obtenido exitosamente", {
    message: `¡Hola, ${user.nombre}! Este es tu perfil privado. Solo tú puedes verlo.`,
    userData: user,
  });
}

export async function updatePrivateProfile(req, res) {
  try {
    const userPayload = req.user;
    const userId = userPayload.id;
    const changes = req.body;

    if (!changes || Object.keys(changes).length === 0) {
      return handleErrorClient(res, 400, "Datos para actualizar son requeridos");
    }

    const updated = await updateProfile(userId, changes);
    if (updated.password) delete updated.password;

    handleSuccess(res, 200, "Perfil actualizado exitosamente", updated);
  } catch (error) {
    if (error.message === "Usuario no encontrado" || error.message.includes("email")) {
      return handleErrorClient(res, 400, error.message);
    }
    handleErrorServer(res, 500, "Error al actualizar perfil", error.message);
  }
}

export async function deletePrivateProfile(req, res) {
  try {
    const userPayload = req.user;
    const userId = userPayload.id;

    const result = await deleteProfile(userId);
    handleSuccess(res, 200, "Perfil eliminado exitosamente", result);
  } catch (error) {
    if (error.message === "Usuario no encontrado") {
      return handleErrorClient(res, 400, error.message);
    }
    handleErrorServer(res, 500, "Error al eliminar perfil", error.message);
  }
}
