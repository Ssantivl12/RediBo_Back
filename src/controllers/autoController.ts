import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAutos = async (req: Request, res: Response) => {
    try{
        const autos = await prisma.auto.findMany();

        res.status(200).json({
            succes: true,
            data: autos,
        });

    }catch (error){
        res.status(500).json({
            success: false,
            message: "Error en obtener los autos",
            error: error instanceof Error? error.message : "Error desconocido",
        });
    }
};