// src/routes/pagoConTarjetaRoute.ts
import { Router } from 'express';
import { crearPagoConTarjetaController } from '../controllers/pagoConTarjetaController';

const router = Router();

router.post('/', crearPagoConTarjetaController);

export default router;
