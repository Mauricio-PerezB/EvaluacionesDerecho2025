import "dotenv/config";
import express from "express";
import morgan from "morgan";
import { connectDB } from "./config/configDb.js";
import cors from "cors";
// Note: routerApi is imported dynamically after DB connection to avoid import-time
// module resolution errors while migrating modules to ESM. If dynamic import fails
// we still start a minimal server so you can iterate on fixes.
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Ruta principal de bienvenida
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/frontend', express.static(path.join(__dirname, 'frontend')));
app.get("/", (req, res) => {
  res.send("¡Bienvenido a mi API REST con TypeORM!");
});

async function start() {
  const serverStart = () => {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Servidor iniciado en http://localhost:${PORT}`);
    });
  };

  try {
    const ok = await connectDB();
    if (!ok) console.warn('Advertencia: la base de datos no está disponible. Arrancando sin conexión a BD.');
  } catch (err) {
    console.warn('Advertencia: fallo al intentar conectar a la BD:', err);
  }

  try {
    const mod = await import('./routes/index.routes.js');
    if (mod && typeof mod.routerApi === 'function') await mod.routerApi(app);
  } catch (err) {
    console.warn('No se pudo cargar rutas dinámicamente:', err.message || err);
  }

  serverStart();
}

start();