import { Router } from "express";
import { getAutos, getAutoId, getComentarios } from "../controllers/autoController";
import { getAutos, getAutoId, getCalificacion } from "../controllers/autoController";

const router = Router();

router.get('/autos', getAutos);
router.get('/autos/:id', getAutoId);
router.get('/autos/:id/comentarios', getComentarios);
router.get('/autos/:id/calificacion', getCalificacion);

export default router;