import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import cors from 'cors';

import rutasPago from './routes/pago.routes';
import qrRoutes from './routes/generarQRRoute';
<<<<<<< Updated upstream
import historialBusquedaRoutes from './routes/historialBusquedaRoutes';
import  vehiculoRouter  from './routes/vehiculoRoutes';

const cors = require('cors');

=======
import { vehicleRouter } from './routes/vehiculoRoutes';
import reservasRoutes from './routes/reservas.routes'; // Rutas de reservaciones
>>>>>>> Stashed changes

// Inicializar Express
const app = express();

// Configuración de dotenv para variables de entorno
dotenv.config();

// Middlewares globales
app.use(cors());
app.use(express.json());

// Servir archivos estáticos de /src/temp
app.use('/temp', express.static(path.join(process.cwd(), 'src', 'temp'), {
  setHeaders: (res, path) => {
    if (path.endsWith('.png')) {
      res.setHeader('Content-Type', 'image/png');
    }
  }
}));

// 📚 Rutas de APIs
app.use('/pagos', rutasPago);
app.use('/', qrRoutes);
<<<<<<< Updated upstream
app.use('/historial', historialBusquedaRoutes);
=======
app.use('/vehiculo', vehicleRouter);
app.use('/api/reservas', reservasRoutes); // Ruta de reservaciones
>>>>>>> Stashed changes

// 🚀 Levantar el servidor
console.log('📂 Ejecutando index.ts desde:', __filename);

const port = 3000;

app.listen(port, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
});

<<<<<<< Updated upstream

app.use('/vehiculo', vehiculoRouter);

app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});
=======
>>>>>>> Stashed changes
