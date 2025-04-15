
import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';


const router = Router();
const prisma = new PrismaClient();
//para almacenar los temeout en memoria
const expirations = new Map<number, NodeJS.Timeout>();
console.log('✅ reservationRoutes CARGADO');
// Crear una reserva
router.post('/', async (req: Request, res: Response) => {
    console.log('📥 POST /api/reservas recibido');
 
  try {
    const { renter_idrenter, auto_idauto, fecha_inicio, fecha_fin } = req.body;

    // Validar que auto y renter existan
    const auto = await prisma.auto.findUnique({
      where: { idauto: auto_idauto },
    });

    if (!auto) {
      return res.status(404).json({ message: 'Auto no encontrado con ese ID.' });
    }

    const renter = await prisma.renter.findUnique({
      where: { idrenter: renter_idrenter },
    });

    if (!renter) {
      return res.status(404).json({ message: 'Renter no encontrado con ese ID.' });
    }


    // Verificar si ya tiene una reserva activa
    const reservaActiva = await prisma.reserva.findFirst({
      where: {
        renter_idrenter,
        estado: 'pendiente',
        expiracion: {
          gt: new Date(),
        },
      },
    });

    if (reservaActiva) {
      return res.status(400).json({ message: 'Ya tienes una reserva activa.' });
    }

    // Calcular expiración (30 minutos)
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

    // Simulación de notificación (puedes usar correo o SMS real)
    console.log(`🔔 Notificación: Se creó una nueva reserva. Tienes hasta ${expiracion.toLocaleTimeString()} para pagar.`);

    const ahora = new Date().getTime();
const tiempoHastaExpiracion = new Date(expiracion).getTime() - ahora;
const notificacionAntes = tiempoHastaExpiracion - (5 * 60 * 1000); // 5 minutos antes

if (notificacionAntes > 0) {
  const timeout = setTimeout(() => {
    console.log(`⏳ Aviso: Tu reserva #${reserva.idreserva} expirará en 5 minutos (${reserva.expiracion.toLocaleTimeString()})`);
    // Aquí puedes usar nodemailer, twilio, etc.
  }, notificacionAntes);

  expirations.set(reserva.idreserva, timeout);
}

    res.status(201).json({ message: 'Reserva creada', reserva });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear la reserva' });
  }
});

// Confirmar pago
router.post('/pago/:idreserva', async (req: Request, res: Response) => {
  try {
    const { idreserva } = req.params;

    const reserva = await prisma.reserva.findUnique({
      where: { idreserva: parseInt(idreserva) },
    });

    if (!reserva) return res.status(404).json({ message: 'Reserva no encontrada' });
    if (new Date() > reserva.expiracion)
      return res.status(400).json({ message: 'La reserva ha expirado' });

    if (reserva.pagado)
      return res.status(400).json({ message: 'La reserva ya fue pagada' });

    const actualizada = await prisma.reserva.update({
      where: { idreserva: reserva.idreserva },
      data: {
        pagado: true,
        estado: 'confirmada',
      },
    });

    // Simulación de confirmación por correo
    console.log(`✅ Reserva #${reserva.idreserva} confirmada y pagada.`);

    res.status(200).json({ message: 'Pago confirmado', reserva: actualizada });
  } catch (error) {
    res.status(500).json({ error: 'Error al procesar el pago' });
  }
});
// Ver reserva activa y cuándo vence
router.get('/activa/:idrenter', async (req: Request, res: Response) => {
  const { idrenter } = req.params;

  try {
    const reserva = await prisma.reserva.findFirst({
      where: {
        renter_idrenter: parseInt(idrenter),
        estado: 'pendiente',
        expiracion: {
          gt: new Date(),
        },
      },
    });

    if (!reserva) {
      return res.status(404).json({ message: 'No hay reservas activas' });
    }

    const ahora = new Date();
    const tiempoRestanteMs = new Date(reserva.expiracion).getTime() - ahora.getTime();
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
});

// Cancelar reservas expiradas (puedes poner esto en un job o cron)
router.post('/cancelar-expiradas', async (_req: Request, res: Response) => {
  try {
    const resultado = await prisma.reserva.updateMany({
      where: {
        estado: 'pendiente',
        expiracion: {
          lt: new Date(),
        },
      },
      data: {
        estado: 'cancelada',
      },
    });

    console.log(`🛑 Reservas expiradas canceladas: ${resultado.count}`);

    res.status(200).json({ message: 'Reservas expiradas canceladas', resultado });
  } catch (error) {
    res.status(500).json({ error: 'Error al cancelar reservas' });
  }
});
// Para poder cancelar la reserva cuando el cliente se arrepiente de su reserva
router.post('/cancelar/:idreserva', async (req: Request, res: Response) => {
  const { idreserva } = req.params;

  try {
    const reserva = await prisma.reserva.findUnique({
      where: { idreserva: parseInt(idreserva) },
    });

    if (!reserva) {
      return res.status(404).json({ message: 'Reserva no encontrada' });
    }

    if (reserva.estado !== 'pendiente') {
      return res.status(400).json({ message: 'Solo puedes cancelar reservas pendientes' });
    }

    // Cancelar en base de datos
    const cancelada = await prisma.reserva.update({
      where: { idreserva: reserva.idreserva },
      data: {
        estado: 'cancelada',
      },
    });

    // Limpiar timeout de notificación si existe
    const timeout = expirations.get(reserva.idreserva);
    if (timeout) {
      clearTimeout(timeout);
      expirations.delete(reserva.idreserva);
      console.log(`❌ Timeout cancelado para la reserva #${reserva.idreserva}`);
    }

    console.log(`🚫 Reserva #${reserva.idreserva} fue cancelada por el usuario.`);

    res.status(200).json({
      message: '✅ Tu reserva ha sido cancelada correctamente.',
      reserva: cancelada
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al cancelar la reserva' });
  }
});


export default router;


