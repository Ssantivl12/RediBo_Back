import app from './app'; // Importamos la app ya configurada
import { Request, Response } from 'express';

console.log('📂 Ejecutando index.ts desde:', __filename);

const port = 3000;

// Ruta raíz
app.get('/', (req: Request, res: Response) => {
  res.send('Servidor TypeScript corriendo!');
});

// Ruta de prueba para usuarios (solo si la necesitas aquí)
app.post('/api/usuarios', (req: Request, res: Response) => {
  const datos = req.body;
  res.json({ mensaje: 'Datos recibidos', datos });
});

// Levantar el servidor
app.listen(port, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
});
