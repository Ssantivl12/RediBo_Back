import express from "express";
import cors from "cors";
import path from "path";
import alertRoutes from "./routes/alertRoutes";
import carRoutes from "./routes/carRoutes";

const app = express();
const PORT = 5000;

app.use(cors());
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
