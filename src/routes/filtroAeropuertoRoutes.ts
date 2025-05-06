/*
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
*/

// routes/filtroAeropuertoRoutes.ts
import { Router } from 'express';
import { autocompletarAeropuerto, obtenerVehiculosCercanos } from '../controllers/filtroAeropuertoController';

const router = Router();

router.get('/autocompletar', autocompletarAeropuerto);
router.post('/vehiculos-cercanos', obtenerVehiculosCercanos);

export default router;