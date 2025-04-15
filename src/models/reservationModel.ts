import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Crear una nueva reserva

export const createReservation = async (idrenter: string, idauto: string) => {
    const now = new Date()
    const fechaFin = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000) // por ejemplo, reserva de 3 días
    const expiracion = new Date(now.getTime() + 30 * 60 * 1000) // expira en 30 minutos
  
    return await prisma.reserva.create({
      data: {
        fecha_inicio: now,
        fecha_fin: fechaFin,
        expiracion,
        estado: 'pendiente',
        renter_idrenter: parseInt(idrenter),
        auto_idauto: parseInt(idauto),
      },
    })
  }
  
// Buscar una reserva activa por el usuario
export const findActiveReservation = async (idrenter: string) => {
  return await prisma.reserva.findFirst({
    where: {
      renter_idrenter: parseInt(idrenter),
      estado: 'pendiente',
      expiracion: {
        gt: new Date(),
      },
    },
  })
}

// Cancelar las reservas expiradas
export const cancelExpiredReservations = async () => {
  return await prisma.reserva.updateMany({
    where: {
      expiracion: {
        lt: new Date(),
      },
      estado: 'pendiente',
    },
    data: {
      estado: 'cancelada', // ✅ tu modelo usa 'cancelada' no 'cancelled'
    },
  })
}
