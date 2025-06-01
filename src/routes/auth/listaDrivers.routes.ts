import { Router } from 'express';
import { getDriversByRenter } from '../../controllers/auth/listaDrivers/listaDrivers.controller';
import { requireAuth } from '../../middlewares/auth/authMiddleware';

export const router = Router();

router.get('/drivers-by-renter', requireAuth, (req, res, next) => {
  Promise.resolve(getDriversByRenter(req, res)).catch(next);
});
