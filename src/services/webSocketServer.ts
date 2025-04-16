import { WebSocketServer, WebSocket } from 'ws';
import { Server as HTTPServer } from 'http';
import { URL } from 'url';
import { obtenerNoLeidas } from './servicioNotificaciones';
import { Notificacion } from '@prisma/client';

interface ExtWebSocket extends WebSocket {
  userId?: string;
}

//registro de usuarios
const users = new Map<string, ExtWebSocket>();

// Función para crear el servidor WebSocket
export function setupWebSocketServer(server: HTTPServer): void {
  const wss = new WebSocketServer({ server });

  wss.on('connection', (ws: ExtWebSocket, req) => {
    const url = new URL(req.url || '', `http://${req.headers.host}`);
    const userId = url.searchParams.get('userId');

    if (!userId) {
      ws.close();
      return;
    }

    ws.userId = userId;
    users.set(userId, ws);
    console.log(`Usuario conectado: ${userId}`);

    // Enviar notificaciones no leídas al usuario conectado
    obtenerNoLeidas(userId)
    .then((notificaciones: Notificacion[]) => {
      notificaciones.forEach((n: Notificacion) => {
        ws.send(JSON.stringify({
          type: 'notificacion',
          payload: {
            id: n.id,
            titulo: n.titulo,
            mensaje: n.mensaje,
            tipo: n.tipo,
            prioridad: n.prioridad,
            entidadId: n.entidadId,
            tipoEntidad: n.tipoEntidad,
            creadoEn: n.creadoEn,
          },
        }));
      });
    })
    .catch((err) => {
      console.error(`Error obteniendo notificaciones para ${userId}:`, err);
    });

    // Envio de mensaje
    ws.on('message', (data) => {
      try {
        const parsed = JSON.parse(data.toString());
        const { type, to, message } = parsed;

        if (!type || !to) throw new Error('Formato inválido');

        const from = ws.userId ?? 'unknown';

        const target = users.get(to);
        if (target) {
          target.send(JSON.stringify({ from, type, message }));
        } else {
          console.warn(`Usuario destino ${to} no está conectado`);
        }

      } catch (err) {
        console.error('Error al procesar mensaje:', err);
        const from = ws.userId ?? 'undefined';
        ws.send(JSON.stringify({ from, type: "error", message: "Formato de mensaje incorrecto." }));
      }
    });

    ws.on('close', () => {
      if (ws.userId) {
        users.delete(ws.userId);
        console.log(`Usuario desconectado: ${ws.userId}`);
      }
    });
  });
}

export function sendToUser(userId: string, payload: any) {
  const socket = users.get(userId);
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(payload));
  }
}
