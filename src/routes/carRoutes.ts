import { Router } from 'express';
import { getAllCars, getCarById, getCarSummaryController} from '../controllers/carController';

const router = Router();

router.get('/', getAllCars);
router.get('/:id', getCarById);
router.get('/summary/:id', getCarSummaryController);

export default router;
