import { Request, Response } from 'express';
import { CalificacionService } from '../services/calificacion.service';

const calificacionService = new CalificacionService();

export async function crearCalificacionController(req: Request, res: Response) {
  const { rentaId, puntuacion, comentario } = req.body;

  try {
    const nuevaCalificacion = await calificacionService.crearCalificacion({
      rentaId,
      puntuacion,
      texto: comentario // O usa el nombre correcto según tu modelo
    });

    res.status(201).json({ success: true, calificacion: nuevaCalificacion });
  } catch (error) {
    console.error('Error al crear calificación:', error);
    res.status(500).json({ error: error || 'No se pudo crear la calificación.' });
  }
}