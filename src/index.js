import "dotenv/config";
import express from "express";
import morgan from "morgan";
import { AppDataSource, connectDB } from "./config/configDb.js";
import { routerApi } from "./routes/index.routes.js";
import path from 'path';
import { fileURLToPath } from 'url';

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

  // Carga rutas y arranca servidor siempre (modo desarrollo)
  routerApi(app);
  serverStart();
}

start();
