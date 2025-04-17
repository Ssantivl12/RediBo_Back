import { Router } from 'express';
import { NotificacionController } from '../controllers/notificacion';
import { autenticarJWT } from '../middlewares/autenticacion';

export const createNotificacionRoutes = (notificacionController: NotificacionController) => {
  const router = Router();

  // panel de notificaciones
  router.get(
    '/panel/:usuarioId',
    autenticarJWT,
    (req, res) => notificacionController.obtenerPanelNotificaciones(req, res)
  );

  // eliminar notificación
  router.delete(
    '/:id',
    autenticarJWT,
    (req, res) => notificacionController.eliminarNotificacion(req, res)
  );

  // detalle de una notificación
  router.get(
    '/detalle/:id',
    autenticarJWT,
    (req, res) => notificacionController.obtenerDetalleNotificacion(req, res)
  );

  // marcar notificación como leída
  router.put(
    '/marcar-leida/:id',
    autenticarJWT,
    (req, res) => notificacionController.marcarComoLeida(req, res)
  );

  //obtener conteo de notificaciones no leidas
  router.get(
    '/no-leidas/:usuarioId',
    autenticarJWT,
    (req, res) => notificacionController.obtenerConteoNoLeidas(req, res)
  );

  return router;
};