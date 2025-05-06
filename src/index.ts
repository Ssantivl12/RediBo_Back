import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import cors from 'cors';

dotenv.config(); // Cargar variables de entorno primero

// Rutas
import rutasPago from './routes/pago.routes';
import qrRoutes from './routes/generarQRRoute';
import historialBusquedaRoutes from './routes/historialBusquedaRoutes';
import reservasRoutes from './routes/reservas.routes';
import mapaRoutes from './routes/filtroMapaPrecioRoutes';
// import vehiculosRoutes from './routes/vehiculos.routes'; // Para GPS si se habilita
import filtroAeropuertoRoutes from './routes/filtroAeropuertoRoutes';
import filtroXFechasRoutes from './routes/filtroXFechasRoutes';

const app = express();
dotenv.config();

// Middleware
app.use(cors());
app.use(express.json());

// Rutas API
app.use('/pagos', rutasPago);
app.use('/', qrRoutes);
app.use('/historial', historialBusquedaRoutes);
app.use('/reservas', reservasRoutes);
app.use('/mapa', mapaRoutes);
app.use('/aeropuerto', filtroAeropuertoRoutes);
app.use('/vehiculos', filtroXFechasRoutes); // Ahora todo lo relacionado a vehículos entra aquí

// Rutas estáticas para comprobantes
app.use(
  '/cmp',
  express.static(path.join(process.cwd(), 'public', 'cmp'), {
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('.png')) {
        res.set('Content-Type', 'image/png');
      }
    },
  })
);

// Rutas estáticas para códigos QR
app.use(
  '/qr',
  express.static(path.join(process.cwd(), 'public', 'qr'), {
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('.png')) {
        res.set('Content-Type', 'image/png');
      }
    },
  })
);

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
