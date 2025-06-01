import { Router } from 'express';
import { registrarDriverController } from '../../controllers/auth/authRegistroDriver/registroDriver.controller';
import { isAuthenticated } from "../../middlewares/auth/isAuthenticated";

export const router = Router();
router.post('/registro-driver', isAuthenticated, registrarDriverController);

