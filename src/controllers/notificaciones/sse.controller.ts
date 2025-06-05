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
      const { idUsuario, userInfo, error } = JWTUtils.extractAndValidateUser(req);
      
      if (error) {
        res.status(401).json({ error });
        return;
      }

      if (!idUsuario || !userInfo) {
        res.status(401).json({ error: 'Usuario no autenticado' });
        return;
      }

      console.log(`Iniciando conexión SSE para usuario: ${userInfo.nombreCompleto} (ID: ${idUsuario})`);
      
      // Obtener ID de conexión único
      const conexionId = this.sseService.conectarCliente(idUsuario, req, res);
      
      // Agregar información de la conexión al log
      console.log(`Conexión SSE establecida - Usuario: ${idUsuario}, Conexión: ${conexionId}`);
      
    } catch (error) {
      console.error('Error al conectar cliente SSE:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  conectarAutomatico = (req: Request, res: Response): void => {
    try {
      const { idUsuario, userInfo, error } = JWTUtils.extractAndValidateUser(req);
      
      if (error) {
        res.status(401).json({ error });
        return;
      }

      if (!idUsuario || !userInfo) {
        res.status(401).json({ error: 'Usuario no autenticado' });
        return;
      }

      console.log(`Conexión SSE automática para usuario: ${userInfo.nombreCompleto} (ID: ${idUsuario})`);
      
      // Marcar para conexión automática
      this.sseService.marcarUsuarioParaConexion(idUsuario);
      
      // Conectar y obtener ID de conexión
      const conexionId = this.sseService.conectarCliente(idUsuario, req, res);
      
      console.log(`Conexión SSE automática establecida - Usuario: ${idUsuario}, Conexión: ${conexionId}`);
      
    } catch (error) {
      console.error('Error en conexión automática SSE:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  obtenerEstadisticas = (req: Request, res: Response): void => {
    try {
      const { idUsuario, userInfo, error } = JWTUtils.extractAndValidateUser(req);
      
      if (error) {
        res.status(401).json({ error });
        return;
      }

      const estadisticasDetalladas = this.sseService.obtenerEstadisticasDetalladas();
      
      const respuesta = {
        ...estadisticasDetalladas,
        timestamp: new Date().toISOString(),
        usuarioActual: {
          id: idUsuario,
          nombre: userInfo?.nombreCompleto,
          email: userInfo?.email,
          conectado: this.sseService.estaConectado(idUsuario || 0),
          numeroConexiones: this.sseService.obtenerNumeroConexiones(idUsuario || 0)
        }
      };
      
      res.json(respuesta);
    } catch (error) {
      console.error('Error al obtener estadísticas SSE:', error);
      res.status(500).json({ error: 'Error al obtener estadísticas' });
    }
  }

  desconectarCliente = (req: Request, res: Response): void => {
    try {
      const { idUsuario, userInfo, error } = JWTUtils.extractAndValidateUser(req);
      
      if (error) {
        res.status(401).json({ error });
        return;
      }

      if (!idUsuario) {
        res.status(401).json({ error: 'Usuario no autenticado' });
        return;
      }

      const { conexionId, desconectarTodas } = req.body;

      if (conexionId) {
        this.sseService.desconectarPorConexionId(conexionId);
        res.json({ 
          mensaje: `Conexión ${conexionId} del usuario ${userInfo?.nombreCompleto} desconectada` 
        });
      } else if (desconectarTodas) {
        this.sseService.desconectarUsuario(idUsuario);
        res.json({ 
          mensaje: `Todas las conexiones del usuario ${userInfo?.nombreCompleto} (${idUsuario}) desconectadas` 
        });
      } else {
        this.sseService.desconectarUsuario(idUsuario);
        res.json({ 
          mensaje: `Usuario ${userInfo?.nombreCompleto} (${idUsuario}) desconectado exitosamente` 
        });
      }
      
    } catch (error) {
      console.error('Error al desconectar cliente:', error);
      res.status(500).json({ error: 'Error al desconectar cliente' });
    }
  }

  verificarConexion = (req: Request, res: Response): void => {
    try {
      const { idUsuario, userInfo, error } = JWTUtils.extractAndValidateUser(req);
      
      if (error) {
        res.status(401).json({ error });
        return;
      }

      if (!idUsuario) {
        res.status(401).json({ error: 'Usuario no autenticado' });
        return;
      }

      const conectado = this.sseService.estaConectado(idUsuario);
      const numeroConexiones = this.sseService.obtenerNumeroConexiones(idUsuario);
      
      res.json({
        idUsuario,
        nombreCompleto: userInfo?.nombreCompleto,
        email: userInfo?.email,
        conectado,
        numeroConexiones,
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('Error al verificar conexión:', error);
      res.status(500).json({ error: 'Error al verificar conexión' });
    }
  }

  obtenerMisConexiones = (req: Request, res: Response): void => {
    try {
      const { idUsuario, userInfo, error } = JWTUtils.extractAndValidateUser(req);
      
      if (error) {
        res.status(401).json({ error });
        return;
      }

      if (!idUsuario) {
        res.status(401).json({ error: 'Usuario no autenticado' });
        return;
      }

      const estadisticas = this.sseService.obtenerEstadisticasDetalladas();
      const misConexiones = estadisticas.usuariosPorConexiones.find(
        usuario => usuario.idUsuario === idUsuario
      );

      res.json({
        idUsuario,
        nombreCompleto: userInfo?.nombreCompleto,
        conexiones: misConexiones?.conexiones || [],
        numeroConexiones: misConexiones?.numeroConexiones || 0,
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('Error al obtener conexiones del usuario:', error);
      res.status(500).json({ error: 'Error al obtener conexiones' });
    }
  }
}