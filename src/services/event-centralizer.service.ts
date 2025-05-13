import prisma from '../config/database';
import { NotificacionService } from './notificacion.service';
import { TipoDeNotificacion, PrioridadNotificacion } from '@prisma/client';

/**
 * Tipos de eventos que pueden ocurrir en el sistema
 */
export type EventoSistema = 
  | 'RENTA_CANCELADA'
  | 'RENTA_FINALIZADA'
  | 'RESERVA_CANCELADA'
  | 'RESERVA_CONFIRMADA'
  | 'RESERVA_APROBADA'
  | 'RESERVA_RECHAZADA'
  | 'DEPOSITO_CONFIRMADO'
  | 'AUTO_CALIFICADO'
  | 'NUEVA_CALIFICACION';

/**
 * Datos asociados a un evento
 */
export interface EventoData {
  entidadId: string;
  tipoEntidad: string;
  datos?: Record<string, any>;
}

/**
 * Servicio centralizado para monitorear cambios de estado y generar notificaciones
 */
export class EventMonitorService {
  private static instance: EventMonitorService;
  private notificacionService: NotificacionService;

  private constructor() {
    this.notificacionService = NotificacionService.getInstance();
  }

  public static getInstance(): EventMonitorService {
    if (!EventMonitorService.instance) {
      EventMonitorService.instance = new EventMonitorService();
    }
    return EventMonitorService.instance;
  }

  /**
   * Procesa un evento del sistema y genera las notificaciones correspondientes
   * @param evento Tipo de evento ocurrido
   * @param data Datos relacionados con el evento
   */
  public async procesarEvento(evento: EventoSistema, data: EventoData): Promise<boolean> {
    try {
      console.log(`Procesando evento: ${evento}`, data);
      
      // Determinar el receptor de la notificación y crear el mensaje adecuado
      const { usuarioId, titulo, mensaje, prioridad } = await this.prepararNotificacion(evento, data);
      
      if (!usuarioId) {
        console.warn(`No se encontró usuario para notificar del evento ${evento}`);
        return false;
      }

      // Mapear el evento a un tipo de notificación
      const tipoNotificacion = this.mapearEventoATipoNotificacion(evento);

      // Crear la notificación
      await this.notificacionService.crearNotificacion({
        usuarioId,
        titulo,
        mensaje,
        tipo: tipoNotificacion,
        prioridad,
        entidadId: data.entidadId,
        tipoEntidad: data.tipoEntidad
      });

      return true;
    } catch (error) {
      console.error(`Error al procesar evento ${evento}:`, error);
      return false;
    }
  }

  /**
   * Mapea un evento del sistema a un tipo de notificación
   */
  private mapearEventoATipoNotificacion(evento: EventoSistema): TipoDeNotificacion {
    switch (evento) {
      case 'RENTA_CANCELADA':
        return TipoDeNotificacion.ALQUILER_CANCELADO;
      case 'RENTA_FINALIZADA':
        return TipoDeNotificacion.ALQUILER_FINALIZADO;
      case 'RESERVA_CANCELADA':
        return TipoDeNotificacion.RESERVA_CANCELADA;
      case 'RESERVA_CONFIRMADA':
        return TipoDeNotificacion.RESERVA_CONFIRMADA;
      case 'DEPOSITO_CONFIRMADO':
        return TipoDeNotificacion.DEPOSITO_CONFIRMADO;
      case 'AUTO_CALIFICADO':
      case 'NUEVA_CALIFICACION':
        return TipoDeNotificacion.NUEVA_CALIFICACION;
      case 'RESERVA_APROBADA':
      case 'RESERVA_RECHAZADA':
        return TipoDeNotificacion.RESERVA_MODIFICADA;
      default:
        // En caso de un evento no mapeado, usar un tipo genérico
        return TipoDeNotificacion.RESERVA_MODIFICADA;
    }
  }

  /**
   * Determina el destinatario y construye el contenido de la notificación basado en el evento
   */
  private async prepararNotificacion(evento: EventoSistema, data: EventoData): Promise<{
    usuarioId: string | null;
    titulo: string;
    mensaje: string;
    prioridad: PrioridadNotificacion;
  }> {
    let usuarioId: string | null = null;
    let titulo = '';
    let mensaje = '';
    let prioridad: PrioridadNotificacion = PrioridadNotificacion.MEDIA;

    switch (data.tipoEntidad.toLowerCase()) {
      case 'renta': {
        const renta = await prisma.renta.findUnique({
          where: { id: data.entidadId },
          include: { 
            cliente: true,
            auto: true,
            reserva: true
          }
        });

        if (!renta) {
          return { usuarioId: null, titulo: '', mensaje: '', prioridad };
        }

        // Determinar el usuario a notificar (el cliente o el propietario)
        usuarioId = data.datos?.notificarPropietario 
          ? renta.auto.propietarioId 
          : renta.clienteId;

        const autoInfo = `${renta.auto.marca} ${renta.auto.modelo} (${renta.auto.año})`;
        
        switch (evento) {
          case 'RENTA_CANCELADA':
            titulo = 'Renta cancelada';
            mensaje = `Tu renta del vehículo ${autoInfo} ha sido cancelada.`;
            prioridad = PrioridadNotificacion.ALTA;
            break;
          case 'RENTA_FINALIZADA':
            titulo = 'Renta finalizada';
            mensaje = `Tu renta del vehículo ${autoInfo} ha finalizado. ¡Gracias por usar nuestro servicio!`;
            prioridad = PrioridadNotificacion.MEDIA;
            break;
          default:
            titulo = 'Actualización de renta';
            mensaje = `Se ha actualizado el estado de tu renta del vehículo ${autoInfo}.`;
            break;
        }
        break;
      }
      
      case 'reserva': {
        const reserva = await prisma.reserva.findUnique({
          where: { idReserva: data.entidadId },
          include: { 
            cliente: true,
            auto: {
              include: {
                propietario: true
              }
            }
          }
        });

        if (!reserva) {
          return { usuarioId: null, titulo: '', mensaje: '', prioridad };
        }

        // Determinar el usuario a notificar (el cliente o el propietario)
        usuarioId = data.datos?.notificarPropietario 
          ? reserva.auto.propietarioId 
          : reserva.idCliente;

        const autoInfo = `${reserva.auto.marca} ${reserva.auto.modelo} (${reserva.auto.año})`;
        const fechaInicio = reserva.fechaInicio.toLocaleDateString();
        
        switch (evento) {
          case 'RESERVA_CANCELADA':
            titulo = 'Reserva cancelada';
            mensaje = `Tu reserva del vehículo ${autoInfo} para el ${fechaInicio} ha sido cancelada.`;
            prioridad = PrioridadNotificacion.ALTA;
            break;
          case 'RESERVA_CONFIRMADA':
            titulo = 'Reserva confirmada';
            mensaje = `Tu reserva del vehículo ${autoInfo} para el ${fechaInicio} ha sido confirmada.`;
            prioridad = PrioridadNotificacion.ALTA;
            break;
          case 'RESERVA_APROBADA':
            titulo = 'Reserva aprobada';
            mensaje = `Tu reserva del vehículo ${autoInfo} para el ${fechaInicio} ha sido aprobada. Por favor, confirma el pago para completar la reserva.`;
            prioridad = PrioridadNotificacion.ALTA;
            break;
          case 'RESERVA_RECHAZADA':
            titulo = 'Reserva rechazada';
            mensaje = `Lo sentimos, tu reserva del vehículo ${autoInfo} para el ${fechaInicio} ha sido rechazada.`;
            prioridad = PrioridadNotificacion.ALTA;
            break;
          case 'DEPOSITO_CONFIRMADO':
            titulo = 'Depósito confirmado';
            mensaje = `El depósito para tu reserva del vehículo ${autoInfo} ha sido confirmado.`;
            prioridad = PrioridadNotificacion.MEDIA;
            break;
          default:
            titulo = 'Actualización de reserva';
            mensaje = `Se ha actualizado el estado de tu reserva del vehículo ${autoInfo} para el ${fechaInicio}.`;
            break;
        }
        break;
      }

      case 'calificacion': {
        const calificacion = await prisma.calificacion.findUnique({
          where: { id: data.entidadId },
          include: {
            renta: {
              include: {
                cliente: true,
                auto: {
                  include: {
                    propietario: true
                  }
                }
              }
            }
          }
        });

        if (!calificacion) {
          return { usuarioId: null, titulo: '', mensaje: '', prioridad };
        }

        // Notificar al propietario del auto sobre la calificación
        usuarioId = calificacion.renta.auto.propietarioId;
        const autoInfo = `${calificacion.renta.auto.marca} ${calificacion.renta.auto.modelo}`;
        const puntuacion = calificacion.puntuacion;

        switch (evento) {
          case 'AUTO_CALIFICADO':
          case 'NUEVA_CALIFICACION':
            titulo = 'Nueva calificación recibida';
            mensaje = `Tu vehículo ${autoInfo} ha recibido una calificación de ${puntuacion} estrellas.`;
            prioridad = PrioridadNotificacion.MEDIA;
            break;
          default:
            titulo = 'Actualización de calificación';
            mensaje = `Se ha actualizado una calificación para tu vehículo ${autoInfo}.`;
            break;
        }
        break;
      }

      default:
        usuarioId = data.datos?.usuarioId || null;
        titulo = 'Notificación del sistema';
        mensaje = 'Se ha producido un evento en el sistema.';
        break;
    }

    return { usuarioId, titulo, mensaje, prioridad };
  }
}
