import express from 'express';
import dotenv from 'dotenv';

import pagoRoutes from './routes/pago.routes';

dotenv.config();
const app = express();

app.use(express.json());

//RUTA DE APIs

app.use('/pagos', pagoRoutes);

app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});
