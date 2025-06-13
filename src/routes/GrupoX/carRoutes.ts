import { Router } from 'express';
import { getAllCars, getCarById, getCarSummaryController } from '../../controllers/GrupoX/carController';
import { getCommentsByHost } from '../../controllers/GrupoX/carCommentsController';

const router = Router();

// Ruta para obtener todos los autos
router.get('/', getAllCars);

// Ruta para obtener comentarios (más específica)
router.get('/comments', getCommentsByHost);

// Ruta para obtener resumen de auto
router.get('/summary/:id', getCarSummaryController);

// Ruta para obtener auto por ID (más general)
router.get('/:id', getCarById);

export default router;