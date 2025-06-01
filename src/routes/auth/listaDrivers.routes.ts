import { Router } from 'express';
import { isAuthenticated } from '../../middlewares/auth/isAuthenticated';
import { registrarDriverController } from '../../controllers/auth/authRegistroDriver/registroDriver.controller';


export const registroDriverRouter = () => {
  const router = Router();
  router.post('/registro-driver', isAuthenticated, registrarDriverController);
  return router;
};

