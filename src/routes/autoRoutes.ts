import { Router } from "express";
import { getAutos, getAutoId } from "../controllers/autoController";

const router = Router();

router.get('/autos', getAutos);
router.get('/autos/:id', getAutoId);

export default router;