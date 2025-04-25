import prisma from '../config/database';
import { RentaMonitorService } from './rentaMonitor.service';
import { EstatusRenta } from '@prisma/client';

export class RentaService {
    private rentaMonitor: RentaMonitorService;

    constructor() {
        this.rentaMonitor = new RentaMonitorService();
    }

    async actualizarEstadoRenta(rentaId: string, nuevoEstatus: EstatusRenta) {
        const rentaActual = await prisma.renta.findUnique({
            where: { id: rentaId }
        });

        if (!rentaActual) {
            throw new Error('Renta no encontrada');
        }

        const estatusAnterior = rentaActual.estatus;

        const rentaActualizada = await prisma.renta.update({
            where: { id: rentaId },
            data: {
                estatus: nuevoEstatus,
                fechaAprobacion: nuevoEstatus === 'APROBADA' ? new Date() : rentaActual.fechaAprobacion
            }
        });

        if (estatusAnterior !== nuevoEstatus) {
            await this.rentaMonitor.manejarCambioEstado(rentaId, nuevoEstatus, estatusAnterior);
        }

        return rentaActualizada;
    }

    /**
     * Finaliza una renta existente, actualizando su estado y registrando el kilometraje final
     * @param rentaId ID de la renta a finalizar
     * @param kilometrajeFinal Kilometraje del vehículo al finalizar la renta
     * @returns La renta actualizada
     */
    async finalizarRenta(rentaId: string, kilometrajeFinal: number) {
        // Verificar que la renta existe y obtener información actual
        const rentaActual = await prisma.renta.findUnique({
            where: { id: rentaId },
            include: {
                auto: true
            }
        });

        if (!rentaActual) {
            throw new Error('Renta no encontrada');
        }

        // Verificar que la renta esté en un estado válido para ser finalizada
        if (rentaActual.estatus !== EstatusRenta.EN_CURSO && rentaActual.estatus !== EstatusRenta.APROBADA) {
            throw new Error(`No se puede finalizar la renta con estado ${rentaActual.estatus}`);
        }

        // Validar que el kilometraje final sea mayor al inicial
        if (rentaActual.kilometrajeInicial && kilometrajeFinal <= rentaActual.kilometrajeInicial) {
            throw new Error('El kilometraje final debe ser mayor al kilometraje inicial');
        }

        // Actualizar el estado de la renta y el kilometraje final
        const rentaActualizada = await prisma.renta.update({
            where: { id: rentaId },
            data: {
                estatus: EstatusRenta.FINALIZADA,
                kilometrajeFinal
            }
        });

        // Actualizar el kilometraje del auto
        await prisma.auto.update({
            where: { id: rentaActual.autoId },
            data: {
                kilometraje: kilometrajeFinal,
                estado: 'DISPONIBLE'
            }
        });

        // Notificar a los usuarios sobre el cambio de estado
        await this.rentaMonitor.manejarCambioEstado(rentaId, EstatusRenta.FINALIZADA, rentaActual.estatus);

        return rentaActualizada;
    }

    /**
     * Cancela una renta existente
     * @param rentaId ID de la renta a cancelar
     * @param motivo Motivo opcional de la cancelación
     * @returns La renta actualizada
     */
    async cancelarRenta(rentaId: string, motivo?: string) {
        const rentaActual = await prisma.renta.findUnique({
            where: { id: rentaId },
            include: {
                auto: true
            }
        });

        if (!rentaActual) {
            throw new Error('Renta no encontrada');
        }

        if (rentaActual.estatus === EstatusRenta.FINALIZADA || rentaActual.estatus === EstatusRenta.CANCELADA) {
            throw new Error(`No se puede cancelar una renta que ya está ${rentaActual.estatus.toLowerCase()}`);
        }

        const rentaActualizada = await prisma.renta.update({
            where: { id: rentaId },
            data: {
                estatus: EstatusRenta.CANCELADA
            }
        });

        if (rentaActual.auto.estado === 'OCUPADO') {
            await prisma.auto.update({
                where: { id: rentaActual.autoId },
                data: {
                    estado: 'DISPONIBLE'
                }
            });
        }
        await this.rentaMonitor.manejarCambioEstado(rentaId, EstatusRenta.CANCELADA, rentaActual.estatus);

        return rentaActualizada;
    }
}