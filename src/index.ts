import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import http from 'http'; 
import { WebSocketServer, WebSocket as WSSocket } from 'ws';
import path from 'path';

// Cargar variables de entorno
dotenv.config();

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
// End point para verificar la salud de la conexión de la API
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});
//  Crear servidor HTTP
const server = http.createServer(app);

//  Crear servidor WebSocket
const wss = new WebSocketServer({ server });

wss.on('connection', (ws: WSSocket) => {
  console.log(' Cliente WebSocket conectado');

  ws.send(' ¡Conectado al WebSocket del backend!');

  ws.on('message', (message: any) => {
    console.log(' Mensaje recibido del cliente:', message.toString());

    // Modificar aqui para realizar acciones en el servidor
    // - Notificar a otros clientes
    // - Guardar algo en DB
    // - Validar sesiones, etc.

    ws.send(` Servidor recibió: ${message.toString()}`);
  });

  ws.on('close', () => {
    console.log(' Cliente desconectado');
  });
});

// Iniciar el servidor HTTP + WebSocket
server.listen(PORT, () => {
  console.log(` Servidor corriendo en http://localhost:${PORT}`);
});