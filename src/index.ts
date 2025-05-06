import express from "express";
import cors from "cors";
import path from "path";
import helmet from "helmet"; // Seguridad con Helmet

// Importar rutas
import alertRoutes from "./routes/alertRoutes";
import carRoutes from "./routes/carRoutes";
import rentalsRoutes from "./routes/rentals"; // Si usas esto, asegúrate que existe

const app = express();
const PORT = 5000;

// CORS: permite peticiones desde el frontend
app.use(cors({
  origin: 'http://localhost:3002', // ajusta si cambia tu frontend
  credentials: true
}));

// Seguridad
app.use(helmet());

// Middleware para parsear JSON
app.use(express.json());

// Ruta raíz opcional
app.get("/", (req, res) => {
  res.send("🚗 API de RediBo funcionando correctamente");
});

// Servir imágenes si las usas localmente (ahora estás usando URLs externas, así que puedes quitarlo si no hace falta)
app.use('/images', express.static(path.join(__dirname, '..', 'images')));

// Rutas
app.use("/api/alerts", alertRoutes); // usa alerts desde base de datos
app.use("/api/cars", carRoutes);     // sigue igual
app.use("/api/rentals", rentalsRoutes); // solo si tienes esta ruta

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
});
