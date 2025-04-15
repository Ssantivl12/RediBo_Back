import { Router } from 'express';
import reservationRouter from './reservationRoutes';

const router = Router();

// Montamos las rutas del reservationRouter en la raíz
router.use('/', reservationRouter);

export default router;
