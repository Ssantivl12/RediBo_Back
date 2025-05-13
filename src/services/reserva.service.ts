import { PrismaClient, EstadoReserva } from '@prisma/client';
import { EventMonitorService, EventoSistema, EventoData } from './event-centralizer.service';

const prisma = new PrismaClient();

/**
 * Servicio para gestionar las operaciones relacionadas con reservas
 */
export class ReservaService {
  private static instance: ReservaService;
  private eventMonitorService: EventMonitorService;

  private constructor() {
    this.eventMonitorService = EventMonitorService.getInstance();
  }

  /**
   * Obtener la instancia única del servicio (Singleton)
   */
  public static getInstance(): ReservaService {
    if (!ReservaService.instance) {
      ReservaService.instance = new ReservaService();
    }
    return ReservaService.instance;
  }

  /**
   * Cambiar el estado de una reserva y generar un evento correspondiente
   * @param reservaId ID de la reserva a modificar
   * @param nuevoEstado Nuevo estado a asignar
   */
  async cambiarEstadoReserva(reservaId: string, nuevoEstado: EstadoReserva) {
    // Obtener la reserva actual
    const reservaExistente = await prisma.reserva.findUnique({
      where: { idReserva: reservaId },
      include: { auto: true },
    });
  
    if (!reservaExistente) {
      throw new Error('Reserva no encontrada');
    }
  
    const estadoAnterior = reservaExistente.estado;
  
    // Verificar si el estado realmente cambió
    if (estadoAnterior === nuevoEstado) {
      return { mensaje: 'El estado no ha cambiado.', reserva: reservaExistente };
    }
  
    // Actualizar el estado
    const reservaActualizada = await prisma.reserva.update({
      where: { idReserva: reservaId },
      data: { estado: nuevoEstado },
      include: { auto: true, cliente: true },
    });

    // Determinar el tipo de evento basado en el nuevo estado
    let evento: EventoSistema | null = null;

    switch (nuevoEstado) {
      case 'CONFIRMADA':
        evento = 'RESERVA_CONFIRMADA';
        break;
      case 'CANCELADA':
        evento = 'RESERVA_CANCELADA';
        break;
      case 'APROBADA':
        evento = 'RESERVA_APROBADA';
        break;
      case 'RECHAZADA':
        evento = 'RESERVA_RECHAZADA';
        break;
      default:
        // Para otros cambios de estado que no tengan un evento específico
        break;
    }

    // Si se identificó un evento específico, emitirlo
    if (evento) {
      // Notificar al cliente
      const eventoData: EventoData = {
        entidadId: reservaId,
        tipoEntidad: 'reserva',
        datos: {
          estadoAnterior,
          nuevoEstado,
          notificarPropietario: false // Primero notificamos al cliente
        }
      };
      
      await this.eventMonitorService.procesarEvento(evento, eventoData);
      
      // También notificar al propietario
      const eventoDataPropietario: EventoData = {
        entidadId: reservaId,
        tipoEntidad: 'reserva',
        datos: {
          estadoAnterior,
          nuevoEstado,
          notificarPropietario: true // Notificamos al propietario
        }
      };
      
      await this.eventMonitorService.procesarEvento(evento, eventoDataPropietario);
    }
  
    return { 
      mensaje: 'Estado actualizado correctamente', 
      reserva: reservaActualizada 
    };
  }

  /**
   * Confirmar el depósito de una reserva
   * @param reservaId ID de la reserva a confirmar depósito
   */
  async confirmarDeposito(reservaId: string) {
    const reserva = await prisma.reserva.findUnique({
      where: { idReserva: reservaId },
      include: { auto: true }
    });

    if (!reserva) {
      throw new Error('Reserva no encontrada');
    }

    // Actualizar el campo de depósito confirmado
    const reservaActualizada = await prisma.reserva.update({
      where: { idReserva: reservaId },
      data: { estaPagada: true },
      include: { auto: true }
    });

    // Emitir evento de depósito confirmado
    const eventoData: EventoData = {
      entidadId: reservaId,
      tipoEntidad: 'reserva',
      datos: {
        notificarPropietario: false // Notificar al cliente
      }
    };
    
    await this.eventMonitorService.procesarEvento('DEPOSITO_CONFIRMADO', eventoData);

    // También notificar al propietario
    const eventoDataPropietario: EventoData = {
      entidadId: reservaId,
      tipoEntidad: 'reserva',
      datos: {
        notificarPropietario: true
      }
    };
    
    await this.eventMonitorService.procesarEvento('DEPOSITO_CONFIRMADO', eventoDataPropietario);

    return {
      mensaje: 'Depósito confirmado correctamente',
      reserva: reservaActualizada
    };
  }
}