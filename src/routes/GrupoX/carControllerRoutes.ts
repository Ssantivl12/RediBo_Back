// src/routes/autoRouter.ts
import express from 'express';
import { getAllCars, getCarById, getCarSummaryController } from '../../controllers/GrupoX/carController';

const autoRouter = express.Router();

autoRouter.get('/', getAllCars);
autoRouter.get('/:id', getCarById);
autoRouter.get('/:id/summary', getCarSummaryController);

export default autoRouter;