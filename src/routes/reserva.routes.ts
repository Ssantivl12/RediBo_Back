import { Router } from 'express';
import { ReservaController } from '../controllers/reserva.controller';

const reservaController = new ReservaController();

export const createReservaRoutes = (reservaController: ReservaController) => {
  const router = Router();

  // Cambiar el estado de una reserva
  router.put(
    '/cambiar-estado-reserva/:reservaId',
    (req, res) => reservaController.cambiarEstadoReserva(req, res)
  );

  //   router.post(
  //   '/generar-reserva-confirmada/:reservaId',
  //   reservaController.generarNotificacionReservaConfirmada
  // );

  return router;
};