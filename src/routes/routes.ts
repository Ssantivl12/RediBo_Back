// src/routes/routes.ts
import { Router } from 'express';
import pagoConTarjetaRoute from './pagoConTarjetaRoute';

const router = Router();

router.use('/pago-con-tarjeta', pagoConTarjetaRoute);

export default router;
