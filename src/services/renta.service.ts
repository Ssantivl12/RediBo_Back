import prisma from '../config/database';
import { EventMonitorService } from './event-centralizer.service';
import { EstatusRenta } from '@prisma/client';

export class RentaService {
  private static instance: RentaService;
  private eventMonitor: EventMonitorService;
  
  private constructor() {
    this.eventMonitor = EventMonitorService.getInstance();
  }

  public static getInstance(): RentaService {
    if (!RentaService.instance) {
      RentaService.instance = new RentaService();
    }
    return RentaService.instance;
  }

  /**
   * Cancela una renta y dispara el evento correspondiente
   * @param rentaId ID de la renta a cancelar
   */
  public async cancelarRenta(rentaId: string): Promise<boolean> {
    try {
      const renta = await prisma.renta.findUnique({
        where: { id: rentaId },
        include: {
          auto: true,
          cliente: true
        }
      });

      if (!renta) {
        console.error(`Renta ${rentaId} no encontrada.`);
        return false;
      }

      // Actualizar el estado de la renta
      await prisma.renta.update({
        where: { id: rentaId },
        data: { estatus: EstatusRenta.CANCELADA }
      });

      // Notificar al cliente
      await this.eventMonitor.procesarEvento('RENTA_CANCELADA', {
        entidadId: rentaId,
        tipoEntidad: 'Renta',
        datos: {
          notificarPropietario: false
        }
      });

      // Notificar al propietario del auto
      await this.eventMonitor.procesarEvento('RENTA_CANCELADA', {
        entidadId: rentaId,
        tipoEntidad: 'Renta',
        datos: {
          notificarPropietario: true
        }
      });

      return true;
    } catch (error) {
      console.error('Error al cancelar renta:', error);
      return false;
    }
  }

  /**
   * Finaliza una renta y dispara el evento correspondiente
   * @param rentaId ID de la renta a finalizar
   */
  public async finalizarRenta(rentaId: string): Promise<boolean> {
    try {
      const renta = await prisma.renta.findUnique({
        where: { id: rentaId }
      });

      if (!renta) {
        console.error(`Renta ${rentaId} no encontrada.`);
        return false;
      }

      // Actualizar el estado de la renta
      await prisma.renta.update({
        where: { id: rentaId },
        data: { 
          estatus: EstatusRenta.FINALIZADA,
          fechaFin: new Date() 
        }
      });

      // Notificar al cliente
      await this.eventMonitor.procesarEvento('RENTA_FINALIZADA', {
        entidadId: rentaId,
        tipoEntidad: 'Renta',
        datos: {
          notificarPropietario: false
        }
      });

      // Notificar al propietario del auto
      await this.eventMonitor.procesarEvento('RENTA_FINALIZADA', {
        entidadId: rentaId,
        tipoEntidad: 'Renta',
        datos: {
          notificarPropietario: true
        }
      });

      return true;
    } catch (error) {
      console.error('Error al finalizar renta:', error);
      return false;
    }
  }

  /**
   * Verifica las rentas que han finalizado por fecha y dispara los eventos correspondientes
   * Este método podría ser llamado por un job programado
   */
  public async verificarRentasFinalizadas(): Promise<number> {
    try {
      const ahora = new Date();
      
      // Buscar rentas cuya fecha de fin ha pasado pero no están marcadas como finalizadas
      const rentasFinalizadas = await prisma.renta.findMany({
        where: {
          fechaFin: {
            lt: ahora
          },
          estatus: {
            not: EstatusRenta.FINALIZADA
          }
        }
      });

      console.log(`Se encontraron ${rentasFinalizadas.length} rentas finalizadas por fecha`);
      
      // Actualizar cada renta y publicar evento
      for (const renta of rentasFinalizadas) {
        await prisma.renta.update({
          where: { id: renta.id },
          data: { 
            estatus: EstatusRenta.FINALIZADA,
            fechaFin: ahora
          }
        });

        // Notificar al cliente
        await this.eventMonitor.procesarEvento('RENTA_FINALIZADA', {
          entidadId: renta.id,
          tipoEntidad: 'Renta',
          datos: {
            notificarPropietario: false
          }
        });

        // Notificar al propietario del auto
        await this.eventMonitor.procesarEvento('RENTA_FINALIZADA', {
          entidadId: renta.id,
          tipoEntidad: 'Renta',
          datos: {
            notificarPropietario: true
          }
        });
      }

      return rentasFinalizadas.length;
    } catch (error) {
      console.error('Error al verificar rentas finalizadas:', error);
      return 0;
    }
  }
}