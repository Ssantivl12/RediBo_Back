import { PrismaClient } from '@prisma/client';
import { format } from 'date-fns';

const prisma = new PrismaClient();

export const getAlertsFromDB = async () => {
  const rentals = await prisma.rental.findMany({
    where: {
      endDate: {
        lt: new Date(), // Solo vencidos
      },
    },
    include: {
      auto: {
        include: {
          host: true,
        },
      },
      renter: true,
    },
  });

  const now = new Date();

  const alerts = rentals.map((rental) => {
    const end = new Date(rental.endDate);
    const start = new Date(rental.startDate);
    const diff = Math.abs(now.getTime() - end.getTime()) / 36e5; // en horas

    const hours = Math.floor(diff);
    const minutes = Math.round((diff - hours) * 60);
    const exceededTime = `${hours}:${minutes.toString().padStart(2, '0')} hrs`;

    return {
      id: rental.id,
      car: rental.auto.marca,
      model: rental.auto.modelo,
      brand: rental.auto.marca,
      tenant: rental.renter.nombre,
      date: format(start, 'dd/MM/yyyy'),
      time: format(start, 'HH:mm'),
      exceededTime,
      returnInfo: format(end, 'dd/MM/yyyy - HH:mm'),
      imageUrl: rental.auto.imagen,
      viewed: false,
    };
  });

  return alerts;
};
