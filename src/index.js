import "dotenv/config";
import express from "express";
import morgan from "morgan";
<<<<<<< HEAD
import { AppDataSource, connectDB } from "./config/configDb.js";
import { routerApi } from "./routes/index.routes.js";
import path from 'path';
import { fileURLToPath } from 'url';
=======
import { connectDB } from "./config/configDb.js";
// Note: routerApi is imported dynamically after DB connection to avoid import-time
// module resolution errors while migrating modules to ESM. If dynamic import fails
// we still start a minimal server so you can iterate on fixes.
>>>>>>> main

const app = express();
app.use(express.json());
app.use(morgan("dev"));
// Servir frontend estático en /frontend
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/frontend', express.static(path.join(__dirname, 'frontend')));
// Ruta principal de bienvenida
app.get("/", (req, res) => {
  res.send("¡Bienvenido a mi API REST con TypeORM!");
});

// Inicializa la conexión a la base de datos
<<<<<<< HEAD
async function start() {
  const serverStart = () => {
=======
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
>>>>>>> main
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Servidor iniciado en http://localhost:${PORT}`);
    });
<<<<<<< HEAD
  };

  try {
    const ok = await connectDB();
    if (!ok) console.warn('Advertencia: la base de datos no está disponible. Arrancando sin conexión a BD.');
  } catch (err) {
    console.warn('Advertencia: fallo al intentar conectar a la BD:', err);
  }

  // Carga rutas y arranca servidor siempre (modo desarrollo)
  routerApi(app);
  serverStart();
}

start();
=======
  })
  .catch((error) => {
    console.log("Error al conectar con la base de datos:", error);
    process.exit(1);
  });
>>>>>>> main
