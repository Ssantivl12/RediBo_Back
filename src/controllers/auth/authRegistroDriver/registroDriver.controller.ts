import { Request, Response } from "express";
import { registrarDriverCompleto } from "../../../services/auth/registroDriver.service";
import { JwtPayload } from "jsonwebtoken";

export const registrarDriverController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      sexo,
      telefono,
      licencia,
      tipoLicencia,
      fechaEmision,
      fechaExpiracion,
      anversoUrl,
      reversoUrl,
      rentersIds,
    } = req.body;

    console.log("📥 Datos recibidos del formulario:", req.body); // 👈 LOG 1
    console.log("👤 Usuario autenticado en req.user:", req.user); // 👈 LOG 2

    if (!Array.isArray(rentersIds) || rentersIds.length === 0) {
      res.status(400).json({ message: "Debes seleccionar al menos un renter" });
      console.log("🔴 Respuesta del backend:", res.status);
      return;
    }

    const usuario = req.user as JwtPayload;
    if (!usuario || typeof usuario !== "object" || !("idUsuario" in usuario)) {
      console.error("Usuario no autenticado o inválido:", usuario);
      console.log("🔴 Respuesta del backend:", res.status);
      return;
    }


    await registrarDriverCompleto({
      idUsuario: Number((usuario as any).idUsuario),
      sexo,
      telefono,
      licencia,
      tipoLicencia,
      fechaEmision: new Date(fechaEmision),
      fechaExpiracion: new Date(fechaExpiracion),
      anversoUrl,
      reversoUrl,
      rentersIds,
    });

    if (!sexo || !licencia || !tipoLicencia || !fechaEmision || !fechaExpiracion) {
  res.status(400).json({ message: "Faltan campos requeridos" });
  return;
}


    res.status(201).json({ message: "Registro de driver exitoso" });
  } catch (error) {
    console.error("Error en registrarDriverController:", error);
    res
      .status(500)
      .json({ message: "Error al registrar driver", error: String(error) });
    console.log("🔴 Respuesta del backend:", res.status);
  }
};
