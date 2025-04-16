// src/routes/notificaciones.routes.ts
import express from 'express';
import { generarNotificacionRentaConcluida, marcarLeida } from '../controllers/notificaciones.controller';

const router = express.Router();

// Ruta para generar notificación de renta finalizada
router.post('/notificaciones/generar/:rentaId', generarNotificacionRentaConcluida);

// Ruta para marcar una notificación como leída
router.patch('/notificaciones/:id/leida', marcarLeida);

export default router;
