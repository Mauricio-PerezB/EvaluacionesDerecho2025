import { Router } from "express";

export async function routerApi(app) {
  const router = Router();
  app.use("/api", router);

  // Load auth and horarios routes (horarios requires Profesor role to create)
  const routeDefs = [
    { path: "/auth", file: "./auth.routes.js" },
    { path: "/horarios", file: "./horario.routes.js" },
  ];

  for (const r of routeDefs) {
    try {
      const mod = await import(r.file);
      const routerModule = mod.default || mod.router;
      if (routerModule) router.use(r.path, routerModule);
    } catch (err) {
      console.warn(`No se pudo cargar ruta ${r.path}:`, err.message || err);
    }
  }

  return router;
}
