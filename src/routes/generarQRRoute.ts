import { Router } from 'express';
import { generarQR } from '../controllers/generarQRController';

const router = Router();

router.get('/generarQR/:monto/:referencia', generarQR);

export default router;
