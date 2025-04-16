import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import rutasPago from './routes/pago.routes';
import qrRoutes from './routes/generarQRRoute';
const cors = require('cors');

// Inicializar la aplicación de Express
const app = express();

// Configuración de dotenv para acceder a variables de entorno
dotenv.config();

// Usar CORS para permitir solicitudes desde otros orígenes
app.use(cors());

// Usar JSON middleware para analizar cuerpos de solicitudes
app.use(express.json());

// Servir archivos estáticos desde /temp
// Usamos process.cwd() para asegurarnos de que se use la raíz del proyecto
app.use('/temp', express.static(path.join(process.cwd(), 'src', 'temp'), {
  setHeaders: (res, path) => {
    if (path.endsWith('.png')) {
      res.set('Content-Type', 'image/png');
    }
  }
}));


// Rutas de APIs
app.use('/pagos', rutasPago);
app.use('/', qrRoutes);

// Iniciar el servidor en el puerto 3000
app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});