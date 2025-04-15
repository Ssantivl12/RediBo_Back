// src/app.ts
import express from 'express';
import reservationRoutes from './routes/reservationRoutes'; // Asegúrate de que esta ruta es correcta
console.log('📂 Ejecutando app.ts desde:', __filename);

const app = express();

app.use(express.json()); // Middleware para leer JSON

// Aquí conectas tus rutas
app.use('/api/reservas', reservationRoutes);

//app.listen(3000, () => {
  //console.log('Servidor en puerto 3000');
//});

export default app;