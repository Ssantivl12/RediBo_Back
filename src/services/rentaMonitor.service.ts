import prisma from '../config/database';
import { NotificacionService } from './notificacion.service';
import { SSEService } from './sse.service';
import { EstatusRenta } from '@prisma/client';

export class RentaMonitorService {
    private notificacionService: NotificacionService;
    
    constructor() {
        const sseService = new SSEService();
        this.notificacionService = new NotificacionService(sseService);
    }

    async manejarCambioEstado(rentaId: string, nuevoEstatus: EstatusRenta, estatusAnterior: EstatusRenta) {
        const renta = await prisma.renta.findUnique({
            where: { id: rentaId },
            include: {
                auto: {
                    include: {
                        propietario: true
                    }
                },
                cliente: true
            }
        });

        if (!renta) return;

        switch (nuevoEstatus) {
            case EstatusRenta.FINALIZADA:
                await this.notificarRentaFinalizada(renta);
                break;
            case EstatusRenta.CANCELADA:
                await this.notificarRentaCancelada(renta);
                break;

        }
    }

     async notificarRentaFinalizada(renta: any) {
        await this.notificacionService.crearNotificacion({
            usuarioId: renta.cliente.id,
            titulo: 'Renta Finalizada',
            mensaje: `Se ha finalizado correctamente tu renta del vehículo ${renta.auto.marca} ${renta.auto.modelo} (${renta.auto.placa}).`,
            tipo: 'ALQUILER_FINALIZADO',
            prioridad: 'MEDIA',
            entidadId: renta.id,
            tipoEntidad: 'Renta'
        });

        await this.notificacionService.crearNotificacion({
            usuarioId: renta.auto.propietario.id,
            titulo: 'Renta Finalizada',
            mensaje: `La renta de tu vehículo ${renta.auto.marca} ${renta.auto.modelo} (${renta.auto.placa}) ha finalizado correctamente.`,
            tipo: 'ALQUILER_FINALIZADO',
            prioridad: 'MEDIA',
            entidadId: renta.id,
            tipoEntidad: 'Renta'
        });
    }

     async notificarRentaCancelada(renta: any) {
        await this.notificacionService.crearNotificacion({
            usuarioId: renta.auto.propietario.id,
            titulo: 'Renta Cancelada',
            mensaje: `La renta de tu vehículo ${renta.auto.marca} ${renta.auto.modelo} (${renta.auto.placa}) ha sido cancelada.`,
            tipo: 'RESERVA_CANCELADA',
            prioridad: 'ALTA',
            entidadId: renta.id,
            tipoEntidad: 'Renta'
        });

        await this.notificacionService.crearNotificacion({
            usuarioId: renta.cliente.id,
            titulo: 'Renta Cancelada',
            mensaje: `La renta del vehículo ${renta.auto.marca} ${renta.auto.modelo} (${renta.auto.placa}) ha sido cancelada.`,
            tipo: 'RESERVA_CANCELADA',
            prioridad: 'ALTA',
            entidadId: renta.id,
            tipoEntidad: 'Renta'
        });

    }
}