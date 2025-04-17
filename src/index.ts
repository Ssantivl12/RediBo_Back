// server.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import http from 'http';
import dotenv from 'dotenv';
import path from 'path';
import { WebSocketServer, WebSocket as WSSocket } from 'ws';
import { WebSocketService } from './services/websocket';
import { NotificacionService } from './services/notificacion';
import { NotificacionController } from './controllers/notificacion';
import { createNotificacionRoutes } from './routes/notificacion';

// Cargar variables de entorno
dotenv.config();

// Crear aplicación Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurar CSP para permitir scripts en línea
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'"], // Permitir inline scripts
  },
}));

// Sirviendo archivos estáticos (como HTML) desde una carpeta pública
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Crear servidor HTTP
const server = http.createServer(app);

// Inicializar WebSocket Service
const wsService = new WebSocketService(server);

// Crear servidor WebSocket nativo
const wss = new WebSocketServer({ server });

wss.on('connection', (ws: WSSocket) => {
  console.log('Cliente WebSocket conectado');

  ws.send('¡Conectado al WebSocket del backend!');

  ws.on('message', (message: any) => {
    console.log('Mensaje recibido del cliente:', message.toString());

    // Modificar aqui para realizar acciones en el servidor
    // - Notificar a otros clientes
    // - Guardar algo en DB
    // - Validar sesiones, etc.

    ws.send(`Servidor recibió: ${message.toString()}`);
  });

  ws.on('close', () => {
    console.log('Cliente desconectado');
  });
});

// Inicializar servicios y controladores
const notificacionService = new NotificacionService(wsService);
const notificacionController = new NotificacionController(notificacionService);

// Configurar rutas
app.use('/api/notificaciones', createNotificacionRoutes(notificacionController));

// Ruta para verificar que el servidor está funcionando
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Iniciar servidor
server.listen(PORT, () => {
  console.log(`Servidor iniciado en puerto ${PORT}`);
  console.log(`API REST: http://localhost:${PORT}/api`);
  console.log(`WebSockets: ws://localhost:${PORT}/ws`);
});

// Manejar errores no capturados
process.on('uncaughtException', (error) => {
  console.error('Error no capturado:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Promesa rechazada no manejada:', reason);
});