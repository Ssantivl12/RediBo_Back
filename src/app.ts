// src/app.ts
import express from 'express';
import reservationRoutes from './routes/reservas.route';
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json()); // Middleware para parsear JSON en el cuerpo de la solicitud

app.use('/api/reservas', reservationRoutes); // Rutas de reservas

export default app;
