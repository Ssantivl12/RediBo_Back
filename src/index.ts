import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

import router from './routes/routes';

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// End point para verificar la salud de la conexión de la API
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Importar rutas
app.use('/api', router);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);

  console.log(`Servidor funcionando en puerto  ${PORT}`);
});


/* app.use(cors({
origin: 'http://localhost:5173' // para uso del frontend en localhost:5173
})); */