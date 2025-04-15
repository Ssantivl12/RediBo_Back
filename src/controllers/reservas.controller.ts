
import { Request, Response } from 'express';
import prisma from '../config/prisma'
//smjssjdkjds
const expirations = new Map<number, NodeJS.Timeout>();

export const crearReserva = async (req: Request, res: Response) => {
    console.log('📥 POST /api/reservas recibido');
    try {
      const { renter_idrenter, auto_idauto, fecha_inicio, fecha_fin } = req.body;
  
      const auto = await prisma.auto.findUnique({ where: { idauto: auto_idauto } });
      if (!auto) return res.status(404).json({ message: 'Auto no encontrado con ese ID.' });
  
      const renter = await prisma.renter.findUnique({ where: { idrenter: renter_idrenter } });
      if (!renter) return res.status(404).json({ message: 'Renter no encontrado con ese ID.' });
  
      const reservaActiva = await prisma.reserva.findFirst({
        where: {
          renter_idrenter,
          estado: 'pendiente',
          expiracion: { gt: new Date() },
        },
      });
  
      if (reservaActiva) return res.status(400).json({ message: 'Ya tienes una reserva activa.' });
  
      const expiracion = new Date();
      expiracion.setMinutes(expiracion.getMinutes() + 30);
  
      const reserva = await prisma.reserva.create({
        data: {
          renter: { connect: { idrenter: renter_idrenter } },
          auto: { connect: { idauto: auto_idauto } },
          fecha_inicio: new Date(fecha_inicio),
          fecha_fin: new Date(fecha_fin),
          estado: 'pendiente',
          expiracion,
        },
      });
  
      console.log(`🔔 Notificación: Nueva reserva creada. Tienes hasta ${expiracion.toLocaleTimeString()} para pagar.`);
  
      const tiempoHastaExpiracion = expiracion.getTime() - new Date().getTime();
      const notificacionAntes = tiempoHastaExpiracion - (5 * 60 * 1000);
  
      if (notificacionAntes > 0) {
        const timeout = setTimeout(() => {
          console.log(`⏳ Aviso: Reserva #${reserva.idreserva} expirará en 5 minutos (${reserva.expiracion.toLocaleTimeString()})`);
        }, notificacionAntes);
  
        expirations.set(reserva.idreserva, timeout);
      }
  
      res.status(201).json({ message: 'Reserva creada', reserva });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al crear la reserva' });
    }
  };
  
// confirmar pago caso de que si quiero hacer la reservajajsjasj
export const confirmarPago = async (req: Request, res: Response) => {
    try {
      const { idreserva } = req.params;
  
      const reserva = await prisma.reserva.findUnique({ where: { idreserva: parseInt(idreserva) } });
      if (!reserva) return res.status(404).json({ message: 'Reserva no encontrada' });
      if (new Date() > reserva.expiracion) return res.status(400).json({ message: 'La reserva ha expirado' });
      if (reserva.pagado) return res.status(400).json({ message: 'La reserva ya fue pagada' });
  
      const actualizada = await prisma.reserva.update({
        where: { idreserva: reserva.idreserva },
        data: { pagado: true, estado: 'confirmada' },
      });
  
      console.log(`✅ Reserva #${reserva.idreserva} confirmada y pagada.`);
      res.status(200).json({ message: 'Pago confirmado', reserva: actualizada });
    } catch (error) {
      res.status(500).json({ error: 'Error al procesar el pago' });
    }
  };`
  
  `
// Ver reserva activa y cuándo vence
export const verReservaActiva = async (req: Request, res: Response) => {
    try {
      const { idrenter } = req.params;
  
      const reserva = await prisma.reserva.findFirst({
        where: {
          renter_idrenter: parseInt(idrenter),
          estado: 'pendiente',
          expiracion: { gt: new Date() },
        },
      });
  
      if (!reserva) return res.status(404).json({ message: 'No hay reservas activas' });
  
      const ahora = new Date();
      const tiempoRestanteMs = reserva.expiracion.getTime() - ahora.getTime();
      const minutos = Math.floor(tiempoRestanteMs / 60000);
      const segundos = Math.floor((tiempoRestanteMs % 60000) / 1000);
  
      res.status(200).json({
        message: 'Reserva activa encontrada',
        idreserva: reserva.idreserva,
        expiracion: reserva.expiracion.toLocaleString(),
        tiempo_restante: `${minutos} minutos y ${segundos} segundos`,
        reserva,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al buscar la reserva activa' });
    }
  };

  
// Cancelar reservas que ya expiraron (vencio el tiempo de reserva)
export const cancelarExpiradas = async (_req: Request, res: Response) => {
    try {
      const resultado = await prisma.reserva.updateMany({
        where: { estado: 'pendiente', expiracion: { lt: new Date() } },
        data: { estado: 'cancelada' },
      });
  
      console.log(`🛑 Reservas expiradas canceladas: ${resultado.count}`);
      res.status(200).json({ message: 'Reservas expiradas canceladas', resultado });
    } catch (error) {
      res.status(500).json({ error: 'Error al cancelar reservas' });
    }
  };

export const cancelarReserva = async (req: Request, res: Response) => {
    try {
      const { idreserva } = req.params;
  
      const reserva = await prisma.reserva.findUnique({ where: { idreserva: parseInt(idreserva) } });
      if (!reserva) return res.status(404).json({ message: 'Reserva no encontrada' });
      if (reserva.estado !== 'pendiente') return res.status(400).json({ message: 'Solo puedes cancelar reservas pendientes' });
  
      const cancelada = await prisma.reserva.update({
        where: { idreserva: reserva.idreserva },
        data: { estado: 'cancelada' },
      });
  
      const timeout = expirations.get(reserva.idreserva);
      if (timeout) {
        clearTimeout(timeout);
        expirations.delete(reserva.idreserva);
        console.log(`❌ Timeout cancelado para reserva #${reserva.idreserva}`);
      }
  
      console.log(`🚫 Reserva #${reserva.idreserva} fue cancelada por el usuario.`);
      res.status(200).json({ message: '✅ Tu reserva ha sido cancelada correctamente.', reserva: cancelada });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al cancelar la reserva' });
    }
};
  

