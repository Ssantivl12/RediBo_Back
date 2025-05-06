import { Router } from "express";
import {
  getAllAlerts,
  getAlertById,
  deleteAlert,
} from "../controllers/alertController";

const router = Router();

router.get("/alerts", getAllAlerts);
router.get("/alerts/:id", getAlertById);
router.delete("/alerts/:id", deleteAlert);

export default router;
