import { Router } from 'express';
import pagoConTarjetaRoute from './pagoConTarjetaRoute';


const router = Router();

router.use('/pago', pagoConTarjetaRoute);


export default router;
