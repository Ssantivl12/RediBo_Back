import { Router, Request, Response } from 'express';
import { RentaController } from '../controllers/renta.controller';

export const createRentaRoutes = (rentaController: RentaController) => {
  const router = Router();
  
  router.put('/renta/actualizar-estado/:rentaId', (req: Request, res: Response) => {
    return rentaController.actualizarEstadoRenta(req, res);
  });
  
  router.put('/renta/finalizar/:rentaId', (req: Request, res: Response) => {
    return rentaController.finalizarRenta(req, res);
  });
  
  router.put('/renta/cancelar/:rentaId', (req: Request, res: Response) => {
    return rentaController.cancelarRenta(req, res);
  });
    
  return router;
};