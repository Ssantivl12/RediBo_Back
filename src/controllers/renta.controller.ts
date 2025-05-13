import { Request, Response } from 'express';
import { RentaService } from '../services/renta.service';

export class RentaController {
  private rentaService: RentaService;

  constructor() {
    this.rentaService = RentaService.getInstance();
  }

  public static getInstance(): RentaController {
    return new RentaController();
  }

  /**
   * Endpoint para generar notificación de renta finalizada
   */
  async generarNotificacionRentaConcluida(req: Request, res: Response) {
    const { rentaId } = req.params;
    try {
      const creada = await this.rentaService.finalizarRenta(rentaId);

      if (creada) {
        res.json({ message: 'Notificación generada correctamente.' });
      } else {
        res.json({ message: 'La notificación ya existía o la renta aún no ha concluido.' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al generar la notificación.' });
    }
  }

  /**
   * Endpoint para generar notificación de renta Cancelada
   */
  async generarNotificacionRentaCancelada(req: Request, res: Response) {
    const { rentaId } = req.params;
    try {
      const creada = await this.rentaService.cancelarRenta(rentaId);
      
      if (creada) {
        res.json({ message: 'Notificación generada correctamente.' });
      } else {
        res.json({ message: 'La notificación ya existía o la renta aún no ha concluido.' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al generar la notificación.' });
    }
  }
}