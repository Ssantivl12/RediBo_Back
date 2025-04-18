import { Router } from 'express';
import { getTopRatedVehicles, getMostRentedVehicles } from '../controllers/vehiculoController';

const router = Router();

router.get('/vehicles/top-rated', getTopRatedVehicles);
router.get('/vehicles/most-rented', getMostRentedVehicles);

export const vehicleRouter = router;