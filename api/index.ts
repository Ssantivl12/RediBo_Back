import { Request, Response } from 'express';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import autoRoutes from "../src/routes/autoRoutes";

const app = express();

// Middlewares
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.get('/', (req: Request, res: Response) => {
  res.send('Bienvenido al back de REDIBO');
});

app.use('/api', autoRoutes);

app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok' });
});

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;