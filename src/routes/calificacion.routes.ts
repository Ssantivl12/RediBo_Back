import { Router } from 'express';
import { crearCalificacionController } from '../controllers/calificacion.controller';

export const createCalificacionRoutes = () => {
  const router = Router();
  router.post('/crear-calificacion', crearCalificacionController);
  return router;
};