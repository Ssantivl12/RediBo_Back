import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.get('/alquileres-vencidos', async (req, res) => {
    const rentals = await prisma.rental.findMany({
      select: {
        id: true,
        startDate:true,
        endDate: true,
        auto: {
          select: {
            marca: true,
            modelo: true,
            imagen: true
        
          }
        },
        renter: {
          select: {
            nombre: true
          }
        }
      }
    });
  
    res.json(rentals);
  });
  

export default router;