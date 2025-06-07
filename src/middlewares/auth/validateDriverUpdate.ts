import { Request, Response, NextFunction } from "express";

export const validateDriverUpdate = (req: Request, res: Response, next: NextFunction) => {
  const { telefono, licencia, tipoLicencia, fechaEmision, fechaExpiracion } = req.body;

  // Validar licencia (solo números, entre 6 y 9 dígitos)
  if (!licencia) {
    return res.status(400).json({ message: "El campo licencia es obligatorio." });
  }

  if (!/^\d+$/.test(licencia)) {
    return res.status(400).json({ message: "La licencia solo debe contener números." });
  }

  if (licencia.length < 6) {
    return res.status(400).json({ message: "La licencia debe tener al menos 6 dígitos." });
  }

  if (licencia.length > 9) {
    return res.status(400).json({ message: "La licencia no debe tener más de 9 dígitos." });
  }

  next(); // continúa si todo es válido
};
