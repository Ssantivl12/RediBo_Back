import { Request, Response } from "express";
import { registrarHostCompleto } from "../../services/pago.service";
import { uploadToCloudinary } from "../../services/upload.service";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const registrarHostCompletoController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const usuario = req.user as { idUsuario: number };
    const {
      placa,
      soat,
      tipo,
      numeroTarjeta,
      fechaExpiracion,
      titular,
      detalles_metodo: detallesMetodo,
    } = req.body;

    console.log('📋 Datos recibidos:', req.body);
    console.log('📁 Archivos recibidos:', req.files);

    // Obtener las imágenes del auto
    const imagenes = (req.files as any)?.imagenes || [];
    const qrImage = (req.files as any)?.qrImage?.[0];

    // Validaciones básicas
    if (!placa || !soat) {
      res.status(400).json({ message: "Placa y SOAT son requeridos" });
      return;
    }

    const tipoFinal =
      tipo === "card"
        ? "TARJETA_DEBITO"
        : tipo === "QR"
        ? "QR"
        : tipo === "cash"
        ? "EFECTIVO"
        : null;

    if (!tipoFinal) {
      res.status(400).json({ message: "Tipo de método de pago inválido" });
      return;
    }

    // Validar que exista ubicación por defecto (idUbicacion = 1)
    const ubicacion = await prisma.ubicacion.findUnique({
      where: { idUbicacion: 1 },
    });
    if (!ubicacion) {
      res.status(400).json({ message: "Ubicación por defecto no encontrada" });
      return;
    }

    // Subir imágenes del vehículo
    const imagenesSubidas = await Promise.all(
      imagenes.map((file: any) => uploadToCloudinary(file))
    );

    // Subir imagen QR si se proporciona
    let imagenQr: string | undefined = undefined;
    if (qrImage) {
      imagenQr = await uploadToCloudinary(qrImage);
    }

    await registrarHostCompleto({
      idPropietario: usuario.idUsuario,
      placa,
      soat,
      imagenes: imagenesSubidas,
      tipo: tipoFinal,
      numeroTarjeta,
      fechaExpiracion,
      titular,
      imagenQr,
      detallesMetodoPago: detalles_metodo,
    });

    res.status(201).json({ success: true, message: "Registro host completo" });
  } catch (error) {
    console.error("❌ Error al registrar host:", error);
    
    // Manejo de errores más específico
    if (error instanceof Error) {
      if (error.message.includes('Unique constraint')) {
        res.status(409).json({ message: "La placa ya está registrada" });
        return;
      }
      if (error.message.includes('Foreign key constraint')) {
        res.status(400).json({ message: "Datos de referencia inválidos" });
        return;
      }
    }
    
    res.status(500).json({ 
      message: "Error interno del servidor",
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
};

