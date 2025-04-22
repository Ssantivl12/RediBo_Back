import { Router } from 'express';
<<<<<<< Updated upstream
import { getTopVehiculos, getVehiculoConReserva } from '../controllers/vehiculoController';
=======
import { getTopVehiculos } from '../controllers/vehiculoController';
>>>>>>> Stashed changes

const router = Router();

router.get('/obtenerVehiculosTop', getTopVehiculos);
<<<<<<< Updated upstream
router.get("/obtenerDetalleVehiculo/:id", getVehiculoConReserva);

=======


>>>>>>> Stashed changes
export default router; // ✅ debe exportar un router
