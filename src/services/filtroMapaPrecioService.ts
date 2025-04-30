import { prisma } from '../config/database';

export const obtenerVehiculosDisponibles = async () => {
  const vehiculos = await prisma.vehiculo.findMany({
    where: {
      disponible: "sí",
    },
    orderBy: {
      idvehiculo: 'asc',
    },
    select: {
      idvehiculo: true,
      tarifa: true,
      ubicacion: {
        select: {
          latitud: true,
          amplitud: true,
        },
      },
    },
  });
  return vehiculos.map(v => ({
    idVehiculo: v.idvehiculo,
    precio: v.tarifa,
    latitud: v.ubicacion?.latitud,
    amplitud: v.ubicacion?.amplitud,
  }));
};