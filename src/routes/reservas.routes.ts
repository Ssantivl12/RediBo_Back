import { Router } from 'express';
import {
  crearReserva,
  confirmarPago,
  verReservaActiva,
  cancelarExpiradas,
  cancelarReserva,
} from '../controllers/reservas.controller';

const router = Router();

router.post('/', crearReserva);
router.post('/pago/:idreserva', confirmarPago);
router.get('/activa/:idrenter', verReservaActiva);
router.post('/cancelar-expiradas', cancelarExpiradas);
router.post('/cancelar/:idreserva', cancelarReserva);

export default router;


