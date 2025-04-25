import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

import { SSEService } from './services/sse.service';
import { NotificacionService } from './services/notificacion.service';
import { RentaService } from './services/renta.service';
import { RentaMonitorService } from './services/rentaMonitor.service';

import { NotificacionController } from './controllers/notificacion.controller';
import { SSEController } from './controllers/sse.controller';
import { RentaController } from './controllers/renta.controller';

import { createNotificacionRoutes } from './routes/notificacion.routes';
import { createRentaRoutes } from './routes/renta.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.socket.setKeepAlive(true);
  req.socket.setTimeout(0);
  next();
});

app.use((req, res, next) => {
  if (req.path.includes('/api/notificaciones/sse')) {
    // Saltar compresión para SSE
    res.set('Content-Encoding', 'identity');
  }
  next();
});

// Services initialization
const sseService = new SSEService();
const notificacionService = new NotificacionService(sseService);
const rentaMonitorService = new RentaMonitorService();
const rentaService = new RentaService();

// Controllers initialization
const notificacionController = new NotificacionController(notificacionService);
const sseController = new SSEController(sseService);
const rentaController = new RentaController();

// Configurar ping periódico para el SSE
setInterval(() => {
  sseService.enviarPing();
}, 30000); // 30 segundos

// Routes configuration
app.use('/api/notificaciones', createNotificacionRoutes(notificacionController, sseController));
app.use('/api', createRentaRoutes(rentaController));

// SSE endpoint for notifications
app.get('/api/notificaciones/sse/:usuarioId', (req, res) => {
  sseController.conectar(req, res);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});


// Handle graceful shutdown
process.on('SIGINT', () => {
  sseService.cleanup();
  process.exit(0);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});