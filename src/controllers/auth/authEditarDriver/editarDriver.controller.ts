import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Extendemos Request para incluir `user` y `files` con tipado más claro
interface MulterRequest extends Request {
  user?: {
    idUsuario: number;
  };
  files?: {
    [fieldname: string]: Express.Multer.File[];
  };
}

export const editarPerfilDriver = async (req: MulterRequest, res: Response): Promise<void> => {
  const idUsuario = req.user?.idUsuario;

  if (!idUsuario) {
    res.status(401).json({ message: "No autorizado: token inválido" });
    return;
  }

  try {
    // Extraemos campos del body
    const {
      telefono,
      licencia,
      tipoLicencia,
      fechaEmision,
      fechaExpiracion
    } = req.body;

    // Extraemos archivos subidos (si existen)
    const anversoFile = req.files?.["anverso"]?.[0];
    const reversoFile = req.files?.["reverso"]?.[0];

    // Construimos el objeto para actualizar
    const updateData: any = {
      telefono,
      licencia,
      tipoLicencia,
      fechaEmision: new Date(fechaEmision),
      fechaExpiracion: new Date(fechaExpiracion)
    };

    if (anversoFile) {
      updateData.anversoUrl = `/uploads/${anversoFile.filename}`;
    }

    if (reversoFile) {
      updateData.reversoUrl = `/uploads/${reversoFile.filename}`;
    }

    // Actualizamos el perfil
    const updatedDriver = await prisma.driver.update({
      where: { idUsuario },
      data: updateData,
      include: {
        usuario: true
      }
    });

    res.status(200).json(updatedDriver);
  } catch (error) {
    console.error("❌ Error al actualizar perfil del driver:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};
