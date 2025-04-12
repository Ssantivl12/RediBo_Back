import { Router } from "express";
import { getAutos, getAutoId, getCalificacion } from "../controllers/autoController";

const router = Router();

router.get('/autos', getAutos);
router.get('/autos/:id', getAutoId);
router.get('/autos/:id/calificacion', getCalificacion);

export default router;