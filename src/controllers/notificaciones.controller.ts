// src/controllers/notificaciones.controller.ts
import { Request, Response } from 'express';
import { notificarRentaConcluida, marcarNotificacionComoLeida } from '../services/notificaciones.service';

/**
 * Endpoint para generar notificación de renta finalizada
 */
export async function generarNotificacionRentaConcluida(req: Request, res: Response) {
  const { rentaId } = req.params;
  try {
    await notificarRentaConcluida(rentaId);
    res.json({ message: 'Notificación generada correctamente.' });
  } catch (error) {
    res.status(500).json({ error: 'Error al generar la notificación.' });
  }
}

/**
 * Endpoint para marcar una notificación como leída
 **/
export async function marcarLeida(req: Request, res: Response) {
  const { id } = req.params;
  try {
    await marcarNotificacionComoLeida(id);
    res.json({ message: 'Notificación marcada como leída.' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la notificación.' });
  }
}
