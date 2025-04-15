import { Router } from 'express';
import * as PagoController from '../controllers/pago.controller';

const router = Router();

router.post('/', PagoController.realizarPago);
router.get('/', PagoController.obtenerPagos);

export default router;
