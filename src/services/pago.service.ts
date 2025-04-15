import { prisma } from '../config/database';

export const crearPago = async (data: any) => {
  try {
    const nuevoPago = await prisma.pago.create({ data });
    return nuevoPago;
  } catch (error) {
    console.error('Error al crear el pago:', error);
    throw new Error('Error al crear el pago');
  }
};

export const obtenerPagos = async () => {
  try {
    return await prisma.pago.findMany();
  } catch (error) {
    console.error('Error al obtener los pagos:', error);
    throw new Error('Error al obtener los pagos');
  }
};
