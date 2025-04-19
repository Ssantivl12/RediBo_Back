import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getCarSummary(id: number) {
  try {
    const auto = await prisma.auto.findUnique({
      where: { id },
      include: {
        host: {
          select: { nombre: true },
        },
        rentals: true,
      },
    });

    if (!auto) {
      return { error: 'Auto no encontrado' };
    }

    const vecesAlquilado = auto.rentals.length;

    const hoy = new Date();
    const estado = auto.rentals.some(r =>
      r.startDate <= hoy && hoy <= r.endDate
    ) ? 'rentado' : 'libre';

    return {
      nombreDuenio: auto.host.nombre,
      marca: auto.marca,
      modelo: auto.modelo,
      color: auto.color,
      imagen: auto.imagen,
      vecesAlquilado,
      estado,
    };
  } catch (error) {
    console.error('Error al obtener resumen del auto:', error);
    return { error: 'Error en la consulta' };
  }
}
