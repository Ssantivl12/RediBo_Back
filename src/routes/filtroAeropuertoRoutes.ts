import { Router } from 'express';
import {
  autocompletarAeropuerto,
  obtenerVehiculosCercanos,
} from '../controllers/filtroAeropuertoController';

console.log('autocompletarAeropuerto es:', autocompletarAeropuerto);

const router = Router();

router.get('/autocompletar', autocompletarAeropuerto);
router.get('/vehiculos-cercanos/:id', obtenerVehiculosCercanos);

export default router;

