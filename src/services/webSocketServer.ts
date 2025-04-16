import { WebSocketServer, WebSocket } from 'ws';
import { Server as HTTPServer } from 'http';
import { URL } from 'url';

interface ExtWebSocket extends WebSocket {
  userId?: string;
}

const users = new Map<string, ExtWebSocket>();

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
