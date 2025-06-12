import { Request, Response } from 'express';
import { SSEService } from '../../services/notificaciones/sse.service';
import { JWTUtils } from '../../utils/notificaciones/jwt.utils';

export class SSEController {
  private sseService: SSEService;

  constructor(sseService?: SSEService) {
    this.sseService = sseService || SSEService.getInstance();
  }

  conectar = (req: Request, res: Response): void => {
    try {
      const token = req.query.token as string;
      
      if (!token) {
        res.status(401).json({ error: 'Token requerido' });
        return;
      }

      const { payload, error } = JWTUtils.verifyAndDecodeToken(token);
      
      if (error || !payload) {
        res.status(401).json({ error: error || 'Token inválido' });
        return;
      }

      const idUsuario = payload.idUsuario;
      console.log(`Iniciando conexión SSE para usuario: ${payload.nombreCompleto} (ID: ${idUsuario})`);
      
      this.sseService.conectarCliente(idUsuario, req, res);
      
    } catch (error) {
      console.error('Error al conectar cliente SSE:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  obtenerEstadisticas = (req: Request, res: Response): void => {
    try {
      const token = req.query.token as string;
      
      if (!token) {
        res.status(401).json({ error: 'Token requerido' });
        return;
      }

      const { payload, error } = JWTUtils.verifyAndDecodeToken(token);
      
      if (error || !payload) {
        res.status(401).json({ error: error || 'Token inválido' });
        return;
      }

      const estadisticas = {
        clientesConectados: this.sseService.listarClientesConectados(),
        timestamp: new Date().toISOString(),
        usuarioActual: {
          id: payload.idUsuario,
          nombre: payload.nombreCompleto,
          email: payload.email
        }
      };
      
      res.json(estadisticas);
    } catch (error) {
      console.error('Error al obtener estadísticas SSE:', error);
      res.status(500).json({ error: 'Error al obtener estadísticas' });
    }
  }

  desconectarCliente = (req: Request, res: Response): void => {
    try {
      // Solo puede desconectarse a sí mismo (basado en JWT)
      const { idUsuario, userInfo, error } = JWTUtils.extractAndValidateUser(req);
      
      if (error) {
        res.status(401).json({ error });
        return;
      }

      if (!idUsuario) {
        res.status(401).json({ error: 'Usuario no autenticado' });
        return;
      }

      this.sseService.desconectarCliente(idUsuario);
      res.json({ 
        mensaje: `Usuario ${userInfo?.nombreCompleto} (${idUsuario}) desconectado exitosamente` 
      });
      
    } catch (error) {
      console.error('Error al desconectar cliente:', error);
      res.status(500).json({ error: 'Error al desconectar cliente' });
    }
  }
}