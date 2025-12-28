import * as authService from "../services/auth.service.js";
import * as userService from "../services/user.service.js";
import { handleSuccess, handleErrorClient, handleErrorServer } from "../Handlers/responseHandlers.js";

export const register = async (req, res) => {
  try {
    const { nombre, apellido, rut, email, password } = req.body;
    
    if (!nombre || !apellido || !rut || !email || !password) {
      return handleErrorClient(res, 400, "Faltan campos obligatorios.");
    }

    const newUser = await userService.createUser(req.body);
    
    delete newUser.password;

    return handleSuccess(res, 201, "Usuario registrado exitosamente", newUser);

  } catch (error) {
    if (error.message.includes("ya está registrado")) {
      return handleErrorClient(res, 409, error.message);
    }
    return handleErrorServer(res, 500, "Error al registrar usuario", error.message);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return handleErrorClient(res, 400, "Email y password son requeridos.");
    }

    const { user, token } = await authService.loginUser(email, password);

    return handleSuccess(res, 200, "Login exitoso", { user, token });

  } catch (error) {
    if (error.message.includes("Credenciales incorrectas")) {
      return handleErrorClient(res, 401, "Credenciales incorrectas.");
    }
    return handleErrorServer(res, 500, "Error al iniciar sesión", error.message);
  }
};