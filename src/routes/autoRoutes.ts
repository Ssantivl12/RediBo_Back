import { Router } from "express";
import { getAutos, getAutoId, getComentarios, getHost, getDrivers} from "../controllers/autoController";
import { getAutosDisponiblesPorFecha} from "../controllers/autoController";
import { getUsuarios } from "../controllers/autoController";
import { getCalificacionesHost } from  "../controllers/autoController";

const router = Router();

router.get('/autos', getAutos);
router.get('/autos/:id', getAutoId);
router.get('/autos/:id/comentarios', getComentarios);
router.get('/hosts/:id/:inicio/:fin', getHost);
router.get('/autosDisponibles/:inicio/:fin', getAutosDisponiblesPorFecha);
router.get('/drivers/:id', getDrivers);
router.get('/usuarios', getUsuarios);
router.get('/host/:id', getCalificacionesHost);

export default router;