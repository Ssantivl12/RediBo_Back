import { Router } from 'express';
import { isAuthenticated } from '../../middlewares/auth/isAuthenticated';
import { registrarDriverController } from '../../controllers/auth/authRegistroDriver/registroDriver.controller';


const router = Router();

router.get('/drivers-by-renter', requireAuth, (req, res, next) => {
  Promise.resolve(getDriversByRenter(req, res)).catch(next);
});

export default router;
