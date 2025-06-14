import { Request, Response } from 'express';
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export const getCommentsByHost = async (req: Request, res: Response): Promise<void> => {
  const hostId = Number(req.query.hostId);
  const sortBy = req.query.sortBy === 'rating' ? 'rating' : 'date'; // default: date
  const direction = req.query.direction === 'asc' ? 'asc' : 'desc'; // default: desc

  if (isNaN(hostId)) {
    res.status(400).json({ error: 'hostId inválido' });
    return;
  }

  try {
    const orderBy: Prisma.ComentarioOrderByWithRelationInput[] =
      sortBy === 'rating'
        ? [{ calificacion: direction }]
        : [{ fechaCreacion: direction }];

    const comentarios = await prisma.comentario.findMany({
      where: { auto: { idPropietario: hostId } },
      select: {
        contenido: true,
        fechaCreacion: true,
        calificacion: true,
        usuario: { select: { nombreCompleto: true } },
        auto: {
          select: {
            modelo: true,
            marca: true,
            imagenes: {
              take: 1,
              select: { direccionImagen: true }
            }
          }
        }
      },
      orderBy
    });

    const result = comentarios.map(c => ({
      modelo: c.auto.modelo,
      marca: c.auto.marca,
      direccionImagen: c.auto.imagenes[0]?.direccionImagen ?? null,
      comentarios: c.contenido ?? '',
      calificacionPromedio: c.calificacion,
      date: `${c.fechaCreacion.getDate().toString().padStart(2, '0')}/${(c.fechaCreacion.getMonth() + 1).toString().padStart(2, '0')}/${c.fechaCreacion.getFullYear()}`,
      name: c.usuario.nombreCompleto
    }));

    res.json(result);
  } catch (error) {
    console.error('Error al obtener comentarios por host:', error);
    res.status(500).json({ error: 'Error interno al traer comentarios' });
  } finally {
    await prisma.$disconnect();
  }
};
