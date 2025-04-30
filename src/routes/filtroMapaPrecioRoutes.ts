import { Router } from 'express';
import { getVehiculosDisponibles } from '../controllers/filtroMapaPrecioController';

const router = Router();

router.get('/gps', getVehiculosDisponibles);

export default router;
