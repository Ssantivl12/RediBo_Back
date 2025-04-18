import { Request, Response } from 'express';
import prisma from '../config/database'; 


const expirations = new Map<number, NodeJS.Timeout>();

// Crear nueva reserva
export const crearReserva = async (req: Request, res: Response) : Promise<any> => {
    console.log('📥 POST /api/reservas recibido');
    try {
        const { renter_idrenter, vehiculo_idvehiculo, fecha_inicio, fecha_fin } = req.body;

        const vehiculo = await prisma.vehiculo.findUnique({ where: { idvehiculo: vehiculo_idvehiculo } });
        if (!vehiculo) return res.status(404).json({ message: 'Vehículo no encontrado con ese ID.' });

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
                vehiculo: { connect: { idvehiculo: vehiculo_idvehiculo } },
                fecha_inicio: new Date(fecha_inicio),
                fecha_fin: new Date(fecha_fin),
                estado: 'pendiente',
                expiracion,
            },
        });

        console.log(`🔔 Nueva reserva creada. Expira a las ${expiracion.toLocaleTimeString()}`);

        const tiempoHastaExpiracion = expiracion.getTime() - new Date().getTime();
        const notificacionAntes = tiempoHastaExpiracion - (5 * 60 * 1000);

        if (notificacionAntes > 0) {
            const timeout = setTimeout(() => {
                console.log(`⏳ Aviso: Reserva #${reserva.idreserva} expirará en 5 minutos.`);
            }, notificacionAntes);

            expirations.set(reserva.idreserva, timeout);
        }

        res.status(201).json({ message: 'Reserva creada', reserva });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear la reserva' });
    }
};

// Confirmar pago
export const confirmarPago = async (req: Request, res: Response)  : Promise<any> => {
    try {
        const { idreserva } = req.params;

        const reserva = await prisma.reserva.findUnique({ where: { idreserva: parseInt(idreserva) } });
        if (!reserva) return res.status(404).json({ message: 'Reserva no encontrada' });
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
};

// Ver reserva activa
export const verReservaActiva = async (req: Request, res: Response)  : Promise<any> => {
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

// Cancelar reservas expiradas
export const cancelarExpiradas = async (_req: Request, res: Response)  : Promise<any> => {
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

// Cancelar reserva manual
export const cancelarReserva = async (req: Request, res: Response) : Promise<any> =>{
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
