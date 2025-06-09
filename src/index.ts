import express from "express";
import cors from "cors";
import helmet from "helmet"; // Seguridad con Helmet
import path from "path"; // Utilizar path si es necesario más adelante
import alertRoutes from "./routes/alertRoutes";
import carRoutes from "./routes/carRoutes";
import rentalsRoutes from "./routes/rentals";
import inquilinoRoutes from "./routes/inquilinoRoutes"
import validateWhatsappRouter from "./routes/validateWhatsapp"
import ratingRoutes from './routes/ratingRoutes'
import carControllerRoutes from "./routes/carControllerRoutes"

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

// Rutas de la API
app.use("/api/alerts", alertRoutes);
app.use("/api/cars", carRoutes);
app.use("/api/inquilinos", inquilinoRoutes); 
app.use('/api', validateWhatsappRouter);
app.use('/api/ratings', ratingRoutes);
app.use('/api/autos' , carControllerRoutes);

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
