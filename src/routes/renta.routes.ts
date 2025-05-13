import { Router } from 'express';
import { RentaController } from '../controllers/renta.controller';

const rentaController = new RentaController();

export const createNotificacionRoutes = () => {
  const router = Router();
  // generar notificación de renta finalizada
  router.post(
    '/generar-renta-concluida/:rentaId',
    rentaController.generarNotificacionRentaConcluida
  );

  // generar notificacion de renta cancelada
  router.post(
    '/generar-renta-cancelada/:rentaId',
    rentaController.generarNotificacionRentaCancelada
  );

  return router;
}
