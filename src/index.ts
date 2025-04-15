import express from 'express';
import dotenv from 'dotenv';
import rutasPago from './routes/pago.routes';
import qrRoutes from './routes/generarQRRoute';

dotenv.config();
const app = express();

app.use(express.json());

//RUTA DE APIs

app.use('/pagos', rutasPago);
app.use('/', qrRoutes);

app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});
