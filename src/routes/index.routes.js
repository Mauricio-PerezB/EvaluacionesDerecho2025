import { Router } from "express";
import authRoutes from "./auth.routes.js";
import profileRoutes from "./profile.routes.js";
import preguntaRoutes from "./pregunta.routes.js";
import horarioRoutes from "./horario.routes.js";
import ramoRoutes from "./ramo.routes.js";
import evaluacionRoutes from "./evaluacion.routes.js";
import entregaRoutes from "./entrega.routes.js";
import calificacionRoutes from "./calificacion.routes.js"; 

export function routerApi(app) {
  const router = Router();
  
  app.use("/api", router);

  router.use("/auth", authRoutes);
  router.use("/profile", profileRoutes);
  router.use("/preguntas", preguntaRoutes);
  router.use("/horarios", horarioRoutes);
  router.use("/ramos", ramoRoutes);
  router.use("/evaluaciones", evaluacionRoutes);
  router.use("/entregas", entregaRoutes);
  
  router.use("/calificaciones", calificacionRoutes);

  return router;
}