import express, { Request, Response } from 'express';
import reservationRoutes from './routes/reservationRoutes'; 
console.log('📂 Ejecutando index.ts desde:', __filename);

const app = express();
const port = 3000;

app.use(express.json());
app.use('/api/reservas',reservationRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Servidor TypeScript corriendo!');
});

app.post('/api/usuarios', (req: Request, res: Response) => {
  const datos = req.body;
  res.json({ mensaje: 'Datos recibidos', datos });
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

