import { Router } from 'express';
import { NotificacionController } from '../../controllers/notificaciones/notificacion.controller';
import { SSEController } from '../../controllers/notificaciones/sse.controller';
import { SSEService } from '../../services/notificaciones/sse.service';
import { NotificacionService } from '../../services/notificaciones/notificacion.service';
import { requireAuth, authMiddleware } from '../../middlewares/auth/authMiddleware';

const sseService = SSEService.getInstance();
const notificacionService = new NotificacionService();
const notificacionController = new NotificacionController(notificacionService);
const sseController = new SSEController(sseService);

export const createNotificacionRoutes = () => {
  const router = Router();

// ============================================================================
// Conexión SSE 
// ============================================================================

  // SSE conexion 
  router.get(
    '/sse/connect',
    requireAuth,
    (req, res) => sseController.conectar(req, res)
  );

  // Auto conexion
  router.get('/auto-connect',
     requireAuth, 
     sseController.conectarAutomatico);

  // Obtener estadísticas
  router.get('/stats', 
    requireAuth, 
    sseController.obtenerEstadisticas);

  // Desconectar cliente
  router.post('/disconnect',
     requireAuth, 
     sseController.desconectarCliente);

  // Verificar estado de conexión
  router.get('/status',
     requireAuth, 
     sseController.verificarConexion);

// ============================================================================

  // Home page
  router.get(
    '/', 
    (req, res) => { res.status(200).json({ message: 'Notification API is running' }); }
  );

  // Panel notificaciones
  router.get(
    '/panel-notificaciones',
    requireAuth,
    (req, res) => notificacionController.obtenerPanelNotificaciones(req, res)
  );

  // Eliminar notificacion
  router.delete(
    '/eliminar-notificacion/:id',
    requireAuth,
    (req, res) => notificacionController.eliminarNotificacion(req, res)
  );

  // Detalle de notificacion
  router.get(
    '/detalle-notificacion/:id',
    requireAuth,
    (req, res) => notificacionController.obtenerDetalleNotificacion(req, res)
  );

  // Notificacion leida
  router.put(
    '/notificacion-leida/:id',
    requireAuth,
    (req, res) => notificacionController.marcarComoLeida(req, res)
  );

  // Obtener conteo no leidas
  router.get(
    '/notificaciones-no-leidas',
    requireAuth,
    (req, res) => notificacionController.obtenerConteoNoLeidas(req, res)
  );

  return router;
};