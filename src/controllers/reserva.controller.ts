import { Request, Response } from 'express';
import { EstadoReserva } from '@prisma/client';
import { ReservaService } from '../services/reserva.service';

export class ReservaController {
  private reservaService: ReservaService;

  constructor() {
    this.reservaService = ReservaService.getInstance();
  }

  /**
   * Cambiar el estado de una reserva
   */
  async cambiarEstadoReserva(req: Request, res: Response): Promise<void> {
    try {
      const { reservaId } = req.params;
      const { nuevoEstado } = req.body;

      if (!nuevoEstado) {
        res.status(400).json({ error: 'El nuevo estado es requerido.' });
        return;
      }

      const resultado = await this.reservaService.cambiarEstadoReserva(
        reservaId, 
        nuevoEstado as EstadoReserva
      );
      
      res.json(resultado);
    } catch (error: any) {
      console.error('Error al cambiar el estado de la reserva:', error);
      res.status(500).json({ 
        error: error.message || 'Error al cambiar el estado de la reserva.' 
      });
    }
  }

  /**
   * Confirmar el depósito de una reserva
   */
  async confirmarDeposito(req: Request, res: Response): Promise<void> {
    try {
      const { reservaId } = req.params;
      
      const resultado = await this.reservaService.confirmarDeposito(reservaId);
      
      res.json(resultado);
    } catch (error: any) {
      console.error('Error al confirmar el depósito:', error);
      res.status(500).json({ 
        error: error.message || 'Error al confirmar el depósito de la reserva.' 
      });
    }
  }
}