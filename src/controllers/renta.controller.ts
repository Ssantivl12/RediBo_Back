import { Request, Response } from 'express';
import { RentaService } from '../services/renta.service';

export class RentaController {
    private rentaService: RentaService;

    constructor() {
        this.rentaService = new RentaService();
    }

    async actualizarEstadoRenta(req: Request, res: Response): Promise<void> {
        try {
            const { rentaId } = req.params;
            const { nuevoEstatus } = req.body;

            const rentaActualizada = await this.rentaService.actualizarEstadoRenta(rentaId, nuevoEstatus);
            
            res.status(200).json({
                success: true,
                message: `Renta actualizada a estado: ${rentaActualizada.estatus}`,
                data: rentaActualizada
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                message: error.message || 'Error al actualizar estado de la renta'
            });
        }
    }

    async finalizarRenta(req: Request, res: Response): Promise<void> {
        try {
            const { rentaId } = req.params;
            const { kilometrajeFinal } = req.body;

            if (!kilometrajeFinal || isNaN(kilometrajeFinal)) {
                res.status(400).json({
                    success: false,
                    message: 'El kilometraje final es requerido y debe ser un número válido'
                });
            }

            const rentaFinalizada = await this.rentaService.finalizarRenta(rentaId, Number(kilometrajeFinal));
            
            res.status(200).json({
                success: true,
                message: 'Renta finalizada correctamente',
                data: rentaFinalizada
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                message: error.message || 'Error al finalizar la renta'
            });
        }
    }

    async cancelarRenta(req: Request, res: Response): Promise<void>{
        try {
            const { rentaId } = req.params;
            const { motivo } = req.body;

            const rentaCancelada = await this.rentaService.cancelarRenta(rentaId, motivo);
            
            res.status(200).json({
                success: true,
                message: 'Renta cancelada correctamente',
                data: rentaCancelada
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                message: error.message || 'Error al cancelar la renta'
            });
        }
    }
}