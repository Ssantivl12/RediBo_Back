import { Router } from 'express';
import { getTopVehiculos } from '../controllers/vehiculoController';

const router = Router();

router.get('/obtenerVehiculosTop', getTopVehiculos);


export default router; // ✅ debe exportar un router
