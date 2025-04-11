import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Genera una notificación cuando una renta ha concluido.
 * @param rentaId ID de la renta finalizada
 */
export async function notificarRentaConcluida(rentaId: string): Promise<void> {
  const renta = await prisma.renta.findUnique({
    where: { id: rentaId },
    include: {
      auto: true,
      cliente: true,
    },
  });

  if (renta && renta.fechaFin < new Date()) {
    // Verificamos si ya existe una notificación para esta renta y usuario
    const notificacionExistente = await prisma.notificacion.findFirst({
      where: {
        usuarioId: renta.cliente.id,
        entidadId: renta.id,
        tipo: 'ALQUILER_FINALIZADO',
      },
    });

    if (notificacionExistente) {
      console.log(`Ya existe una notificación para la renta ${renta.id}. No se creará una nueva.`);
      return;
    }

    await prisma.notificacion.create({
      data: {
        usuarioId: renta.cliente.id,
        titulo: 'Renta concluida',
        mensaje: `El vehículo ${renta.auto.modelo} ${renta.auto.marca} con placa ${renta.auto.placa} ha concluido su renta.`,
        tipo: 'ALQUILER_FINALIZADO',
        prioridad: 'MEDIUM',
        entidadId: renta.id,
        tipoEntidad: 'Renta',
      },
    });

    console.log(`Notificación creada para la renta ${renta.id}.`);
  } else {
    console.log(`La renta ${rentaId} no ha finalizado aún o no existe.`);
  }
}
