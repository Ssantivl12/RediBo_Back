import express from 'express';
import { filtroXFechasHandler } from '../controllers/filtroXFechasController';

const router = express.Router();

router.get('/vehiculos/filtroFechas', filtroXFechasHandler);

export default router;

