import { Router } from 'express';
import * as PagoController from '../controllers/pago.controller';

const router = Router();

router.post('/pagarConTarjeta', PagoController.realizarPagoTarjeta);
router.post('/pagarConQR', PagoController.realizarPagoQR);
router.get('/', PagoController.obtenerPagos);

export default router;
