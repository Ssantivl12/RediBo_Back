// src/controllers/comentarioController.ts
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const obtenerComentariosPorAuto = async (req: Request, res: Response) => {
  const idAuto = parseInt(req.params.idAuto);

  if (isNaN(idAuto)) {
    return res.status(400).json({ error: "ID de auto no válido" });
  }

  try {
    const comentarios = await prisma.comentario.findMany({
      where: { idAuto },
      orderBy: { fechaCreacion: "desc" },
      select: {
        usuario: {
          select: {
            nombre: true,
            apellido: true,
          },
        },
        contenido: true,
        calificacion: true,
        fechaCreacion: true,
      },
    });

    const comentariosFormateados = comentarios.map((c) => ({
      autor: `${c.usuario.nombre} ${c.usuario.apellido}`,
      contenido: c.contenido,
      puntuacion: c.calificacion,
      fecha: c.fechaCreacion,
    }));

    res.json(comentariosFormateados);
  } catch (error) {
    console.error("Error al obtener comentarios:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
