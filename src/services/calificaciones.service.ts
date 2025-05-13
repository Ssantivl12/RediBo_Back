import prisma from '../config/database';
import { EventMonitorService } from './event-centralizer.service';

/**
 * Servicio para la gestión de calificaciones
 */
export class CalificacionService {
  private static instance: CalificacionService;
  private eventMonitor: EventMonitorService;
  
  private constructor() { 
    this.eventMonitor = EventMonitorService.getInstance();
  }

  public static getInstance(): CalificacionService {
    if (!CalificacionService.instance) {
      CalificacionService.instance = new CalificacionService();
    }
    return CalificacionService.instance;
  }

  /**
   * Crea una nueva calificación para una renta y dispara el evento correspondiente
   * @param rentaId ID de la renta a calificar
   * @param puntuacion Puntuación de 1 a 5
   * @param comentario Comentario opcional
   */
  public async crearCalificacion(
    rentaId: string, 
    puntuacion: number, 
    comentario?: string
  ): Promise<any> {
    try {
      // Verificar si la renta existe
      const renta = await prisma.renta.findUnique({
        where: { id: rentaId },
        include: {
          auto: true,
          cliente: true
        }
      });

      if (!renta) {
        throw new Error(`La renta ${rentaId} no existe.`);
      }

      // Verificar si ya existe una calificación para esta renta
      const calificacionExistente = await prisma.calificacion.findUnique({
        where: { rentaId: rentaId }
      });

      if (calificacionExistente) {
        throw new Error(`Ya existe una calificación para la renta ${rentaId}.`);
      }

      // Crear la calificación
      const nuevaCalificacion = await prisma.calificacion.create({
        data: {
          rentaId,
          puntuacion,
          comentario: comentario || null,
          fechaCalificacion: new Date()
        }
      });

      // Notificar al propietario del auto sobre la nueva calificación
      await this.eventMonitor.procesarEvento('NUEVA_CALIFICACION', {
        entidadId: nuevaCalificacion.id,
        tipoEntidad: 'Calificacion',
        datos: {
          puntuacion,
          autoId: renta.autoId,
          clienteId: renta.clienteId
        }
      });

      return nuevaCalificacion;
    } catch (error) {
      console.error('Error al crear calificación:', error);
      throw error;
    }
  }

  /**
   * Actualiza una calificación existente
   * @param calificacionId ID de la calificación a actualizar
   * @param puntuacion Nueva puntuación
   * @param comentario Nuevo comentario
   */
  public async actualizarCalificacion(
    calificacionId: string, 
    puntuacion: number, 
    comentario?: string
  ): Promise<any> {
    try {
      // Verificar si la calificación existe
      const calificacion = await prisma.calificacion.findUnique({
        where: { id: calificacionId },
        include: {
          renta: {
            include: {
              auto: true,
              cliente: true
            }
          }
        }
      });

      if (!calificacion) {
        throw new Error(`La calificación ${calificacionId} no existe.`);
      }

      // Actualizar la calificación
      const calificacionActualizada = await prisma.calificacion.update({
        where: { id: calificacionId },
        data: {
          puntuacion,
          comentario: comentario || null,
          fechaActualizacion: new Date()
        }
      });

      // Notificar al propietario del auto sobre la actualización de la calificación
      await this.eventMonitor.procesarEvento('NUEVA_CALIFICACION', {
        entidadId: calificacionId,
        tipoEntidad: 'Calificacion',
        datos: {
          puntuacion,
          autoId: calificacion.renta.autoId,
          clienteId: calificacion.renta.clienteId,
          esActualizacion: true
        }
      });

      return calificacionActualizada;
    } catch (error) {
      console.error('Error al actualizar calificación:', error);
      throw error;
    }
  }

  /**
   * Elimina una calificación
   * @param calificacionId ID de la calificación a eliminar
   */
  public async eliminarCalificacion(calificacionId: string): Promise<boolean> {
    try {
      // Verificar si la calificación existe
      const calificacion = await prisma.calificacion.findUnique({
        where: { id: calificacionId }
      });

      if (!calificacion) {
        throw new Error(`La calificación ${calificacionId} no existe.`);
      }

      // Eliminar la calificación
      await prisma.calificacion.delete({
        where: { id: calificacionId }
      });

      return true;
    } catch (error) {
      console.error('Error al eliminar calificación:', error);
      throw error;
    }
  }
}