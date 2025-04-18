import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const obtenerTopVehiculos = async () => {
  const resultado = await prisma.vehiculo.findMany({
    select: {
      idvehiculo: true,
      marca: true,
      imagen: true,
      modelo: true,
      tarifa: true,
      color: true,
      calificaciones: {
        select: {
          puntuacion: true,
        },
      },
    },
  });

  // Procesar promedios
  const vehiculosConPromedio = resultado
    .map((vehiculo) => {
      const total = vehiculo.calificaciones.reduce((acc, val) => acc + val.puntuacion, 0);
      const cantidad = vehiculo.calificaciones.length;
      const promedio = cantidad > 0 ? parseFloat((total / cantidad).toFixed(2)) : 0;

      return {
        idvehiculo: vehiculo.idvehiculo,
        imagen:vehiculo.imagen,
        marca: vehiculo.marca,
        modelo: vehiculo.modelo,
        tarifa: vehiculo.tarifa,
        color: vehiculo.color,
        promedio_calificacion: promedio,
      };
    })
    .sort((a, b) => b.promedio_calificacion - a.promedio_calificacion)
    .slice(0, 5); // Top 5

  return vehiculosConPromedio;
};
