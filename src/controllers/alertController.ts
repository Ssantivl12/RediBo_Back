import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllAlerts = async (_req: Request, res: Response) => {
  try {
    const alerts = await prisma.alert.findMany();
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener alertas" });
  }
};

export const getAlertById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const alert = await prisma.alert.findUnique({
      where: { id: parseInt(id) },
    });
    if (!alert) {
      return res.status(404).json({ error: "Alerta no encontrada" });
    }
    res.json(alert);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener alerta" });
  }
};

export const deleteAlert = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.alert.delete({ where: { id: parseInt(id) } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar alerta" });
  }
};
