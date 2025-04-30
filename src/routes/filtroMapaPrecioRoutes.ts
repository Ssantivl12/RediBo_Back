import { Router } from 'express';
import { obtenerTodosLosVehiculos } from '../controllers/filtroMapaPrecioController';

const router = Router();

router.get('/gps', obtenerTodosLosVehiculos);

export default router;
