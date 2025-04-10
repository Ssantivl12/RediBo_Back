import { Router } from "express";
import { getAutos } from "../controllers/autoController";

const router = Router();

router.get('/autos', getAutos);

export default router;