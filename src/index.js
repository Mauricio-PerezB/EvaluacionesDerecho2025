import "dotenv/config";
import express from "express";
import morgan from "morgan";
import { connectDB } from "./config/configDb.js";
// Note: routerApi is imported dynamically after DB connection to avoid import-time
// module resolution errors while migrating modules to ESM. If dynamic import fails
// we still start a minimal server so you can iterate on fixes.

const app = express();
app.use(express.json());
app.use(morgan("dev"));
// Ruta principal de bienvenida
app.get("/", (req, res) => {
  res.send("¡Bienvenido a mi API REST con TypeORM!");
});

// Inicializa la conexión a la base de datos
connectDB()
  .then(() => {
    // Intentamos cargar las rutas dinámicamente. Si fallan por errores de módulos
    // no bloqueamos el arranque: iniciamos un servidor mínimo y reportamos el
    // problema para que puedas corregir los módulos.
    import("./routes/index.routes.js")
      .then((mod) => {
        if (mod && typeof mod.routerApi === "function") mod.routerApi(app);
      })
      .catch((err) => {
        console.warn("No se pudo cargar rutas dinámicamente:", err.message || err);
        console.warn("El servidor continuará en modo limitado. Revisa las rutas/exportaciones.");
      });

    // Levanta el servidor Express
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Servidor iniciado en http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.log("Error al conectar con la base de datos:", error);
    process.exit(1);
  });