import express from "express";
import cors from "cors";
import path from "path";

import helmet from "helmet"; // Seguridad con Helmet


import alertRoutes from "./routes/alertRoutes";
import carRoutes from "./routes/carRoutes";
import rentalsRoutes from "./routes/rentals";

const app = express();
const PORT = 5000;

// CORS configuracion para permitir peticiones desde el frontend
app.use(cors({
  origin: 'http://localhost:3002', // aquí va el puerto del FRONTEND
  credentials: true
}));

// Seguridad con Helmet (opcional, pero recomendable)
app.use(helmet());

app.use(express.json());

// Ruta raíz opcional
app.get("/", (req, res) => {
  res.send("🚗 API de RediBo funcionando correctamente");
});

// ✅ Servir imágenes estáticas
app.use('/images', express.static(path.join(__dirname, '..', 'images')));

// Rutas de la API
app.use("/api/alerts", alertRoutes);
app.use("/api/cars", carRoutes);

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
