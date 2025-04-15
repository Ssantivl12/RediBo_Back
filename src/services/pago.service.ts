import { prisma } from '../config/database';

export const crearPago = async (data: any) => {
  return await prisma.pago.create({ data });
};

export const obtenerPagos = async () => {
  return await prisma.pago.findMany();
};
