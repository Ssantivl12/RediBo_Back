import { prisma } from '../config/database';


export const getAllVehiculos = async () => {
  const vehiculos = await prisma.vehiculo.findMany({
    select: {
      imagen: true,
      tarifa: true,
      marca: true,
      modelo: true,
      ubicacion: {
        select: {
          latitud: true,
          amplitud: true
        }
      }
    }
  });

  return vehiculos.map(v => ({
    imagen: v.imagen,
    precio: v.tarifa,
    nombre_modelo: `${v.marca}-${v.modelo}`,
    latitud: v.ubicacion?.latitud,
    amplitud: v.ubicacion?.amplitud
  }));
};
