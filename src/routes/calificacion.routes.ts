import { Router } from 'express';
import { CalificacionController } from '../controllers/calificaciones.controller';

const rentaController = new CalificacionController();


export const createNotificacionRoutes = () => {
  const router = Router();

  
  // generar notificación de nueva calificación para un vehículo
  router.post(
    '/generar-notificacion-calificacion/:rentaId', 
    rentaController.generarNotificacionNuevaCalificacion
  );

return router;
}