import { Router } from "express";
import { getAutos, getAutoId, getComentarios, getCalificacion, getHost} from "../controllers/autoController";

const router = Router();

router.get('/autos', getAutos);
router.get('/autos/:id', getAutoId);
router.get('/autos/:id/comentarios', getComentarios);
router.get('/autos/:id/calificacion', getCalificacion);
router.get('/autos/:id/host', getHost);

export default router;