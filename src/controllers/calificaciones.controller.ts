import { Request, Response } from 'express';
import { CalificacionService } from '../services/calificaciones.service';

export class CalificacionController {
  private calificacionService: CalificacionService;

  constructor() {
    this.calificacionService = CalificacionService.getInstance();
  }

  public static getInstance(): CalificacionController {
    return new CalificacionController();
  }

  /**
   * Endpoint para generar notificación de nueva calificación
   */
  async generarNotificacionNuevaCalificacion(req: Request, res: Response) {
    const { rentaId } = req.params;
    const { puntuacion, comentario } = req.body;
    
    try {
      const nuevaCalificacion = await this.calificacionService.crearCalificacion(
        rentaId,
        puntuacion,
        comentario
      );
      
      if (nuevaCalificacion) {
        res.json({ 
          message: 'Notificación de calificación generada correctamente.',
          calificacion: nuevaCalificacion
        });
      } else {
        res.json({ message: 'No se pudo crear la calificación.' });
      }
    } catch (error) {
      console.error('Error al generar notificación de calificación:', error);
      res.status(500).json({ error: 'Error al generar la notificación de calificación.' });
    }
  }

  /**
   * Endpoint para actualizar una calificación existente
   */
  async actualizarCalificacion(req: Request, res: Response) {
    const { calificacionId } = req.params;
    const { puntuacion, comentario } = req.body;
    
    try {
      const calificacionActualizada = await this.calificacionService.actualizarCalificacion(
        calificacionId,
        puntuacion,
        comentario
      );
      
      res.json({ 
        message: 'Calificación actualizada correctamente.',
        calificacion: calificacionActualizada
      });
    } catch (error) {
      console.error('Error al actualizar calificación:', error);
      res.status(500).json({ error: 'Error al actualizar la calificación.' });
    }
  }

  /**
   * Endpoint para eliminar una calificación
   */
  async eliminarCalificacion(req: Request, res: Response) {
    const { calificacionId } = req.params;
    
    try {
      const resultado = await this.calificacionService.eliminarCalificacion(calificacionId);
      
      if (resultado) {
        res.json({ message: 'Calificación eliminada correctamente.' });
      } else {
        res.json({ message: 'No se pudo eliminar la calificación.' });
      }
    } catch (error) {
      console.error('Error al eliminar calificación:', error);
      res.status(500).json({ error: 'Error al eliminar la calificación.' });
    }
  }
}