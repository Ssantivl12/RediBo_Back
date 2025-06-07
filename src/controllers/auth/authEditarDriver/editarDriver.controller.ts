// src/controllers/auth/authEditarDriver/editarDriver.controller.ts
import { Response } from "express";
import { PrismaClient } from "@prisma/client";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
import { AuthenticatedRequest } from "../../../middlewares/auth/authDriverMiddleware";

const prisma = new PrismaClient();

// Subir imagen a Cloudinary desde buffer
const uploadToCloudinary = (fileBuffer: Buffer, folder: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result?.secure_url || "");
        }
      }
    );
    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

export const editarPerfilDriver = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const idUsuario = req.user?.idUsuario;

  if (!idUsuario) {
    res.status(401).json({ message: "No autorizado: token inválido" });
    return;
  }

  try {
    const {
      telefono,
      licencia,
      tipoLicencia,
      fechaEmision,
      fechaExpiracion,
    } = req.body;

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const anversoFile = files?.["anverso"]?.[0];
    const reversoFile = files?.["reverso"]?.[0];

    const updateData: any = {
      telefono,
      licencia,
      tipoLicencia,
      fechaEmision: new Date(fechaEmision),
      fechaExpiracion: new Date(fechaExpiracion),
    };

    // Subir imágenes a Cloudinary si existen
    if (anversoFile) {
      const url = await uploadToCloudinary(anversoFile.buffer, "Redibo/licencias");
      updateData.anversoUrl = url;
    }

    if (reversoFile) {
      const url = await uploadToCloudinary(reversoFile.buffer, "Redibo/licencias");
      updateData.reversoUrl = url;
    }

    const updatedDriver = await prisma.driver.update({
      where: { idUsuario },
      data: updateData,
      include: { usuario: true }
    });

    res.status(200).json(updatedDriver);
  } catch (error) {
    console.error("❌ Error al actualizar perfil del driver:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};