import { Server as WebSocketServer } from 'ws';
import { Server } from 'http';
import jwt from 'jsonwebtoken';
import { NotificacionWebSocket } from '../types/notification.types';

export class WebSocketService {
  private wss: WebSocketServer;
  private clientesConectados: Map<string, Set<any>>;
  
  constructor(server: Server) {
    this.wss = new WebSocketServer({ server });
    this.clientesConectados = new Map();
    this.inicializar();
  }

  private inicializar() {
    this.wss.on('connection', (ws, req) => {
      try {
        // Obtener token desde URL (ej: ws://localhost:3000/ws?token=valorToken)
        const urlParams = new URLSearchParams(req.url?.split('?')[1] || '');
        const token = urlParams.get('token');
        
        if (!token) {
          ws.close(1008, 'Token no proporcionado');
          return;
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as any;
        const usuarioId = decoded.userId;
        
        if (!usuarioId) {
          ws.close(1008, 'Token inválido');
          return;
        }
        
        this.registrarCliente(usuarioId, ws);

        ws.send(JSON.stringify({
          evento: 'CONEXION_EXITOSA',
          mensaje: 'Conectado exitosamente al servidor de notificaciones'
        }));
        
        ws.on('close', () => {
          this.eliminarCliente(usuarioId, ws);
          console.log(`Cliente desconectado: ${usuarioId}`);
        });
        
        ws.on('error', (error) => {
          console.error(`Error en WebSocket para usuario ${usuarioId}:`, error);
          this.eliminarCliente(usuarioId, ws);
        });

        ws.on('message', (mensaje) => {
          try {
            const data = JSON.parse(mensaje.toString());

          } catch (e) {
            console.error('Error al procesar mensaje del cliente:', e);
          }
        });
        
      } catch (error) {
        console.error('Error en conexión WebSocket:', error);
        ws.close(1011, 'Error interno del servidor');
      }
    });
  }
  
  private registrarCliente(usuarioId: string, ws: any) {
    if (!this.clientesConectados.has(usuarioId)) {
      this.clientesConectados.set(usuarioId, new Set());
    }
    this.clientesConectados.get(usuarioId)?.add(ws);
  }
  
  private eliminarCliente(usuarioId: string, ws: any) {
    const clientes = this.clientesConectados.get(usuarioId);
    if (clientes) {
      clientes.delete(ws);
      if (clientes.size === 0) {
        this.clientesConectados.delete(usuarioId);
      }
    }
  }
  
  enviarNotificacion(notificacion: NotificacionWebSocket) {
    const clientes = this.clientesConectados.get(notificacion.usuarioId);
    
    if (clientes && clientes.size > 0) {
      const mensaje = JSON.stringify(notificacion);
      
      clientes.forEach(cliente => {
        if (cliente.readyState === 1) { // READY_STATE: OPEN
          cliente.send(mensaje);
        }
      });
      
      console.log(`Notificación enviada a ${clientes.size} conexiones del usuario ${notificacion.usuarioId}`);
    }
  }
  
  enviarNotificacionGeneral(evento: string, data: any) {
    this.wss.clients.forEach(cliente => {
      if (cliente.readyState === 1) { // READY_STATE: OPEN
        cliente.send(JSON.stringify({ evento, data }));
      }
    });
  }
}