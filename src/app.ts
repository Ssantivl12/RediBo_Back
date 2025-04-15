// src/app.ts
import express from 'express';
import cors from 'cors';
import reservationRoutes from './routes/reservas.route';

const app = express();

const corsOptions: cors.CorsOptions = {
  origin: 'http://localhost:5432', 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // métodos permitidos
  credentials: true, // permite el uso de cookies/autenticación
  allowedHeaders: ['Content-Type', 'Authorization'], // headers que se aceptan
};

app.use(cors(corsOptions));
app.use(express.json());

app.use('/api/reservas', reservationRoutes);

export default app;
