import { Router } from "express";
import { getAutos, getAutoId, getComentarios } from "../controllers/autoController";

const router = Router();

router.get('/autos', getAutos);
router.get('/autos/:id', getAutoId);
router.get('/autos/:id/comentarios', getComentarios);

export default router;