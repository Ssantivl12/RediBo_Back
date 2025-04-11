import { Request, Response, NextFunction } from 'express';

export const validarPago = (req: Request, res: Response, next: NextFunction) => {
  const { monto, referencia } = req.body;
  const { vehiculoid, metodo } = req.params;

  const montoNumerico = parseFloat(monto);

  if (!monto || isNaN(montoNumerico)) {
    return res.status(400).json({ error: 'Monto inválido o faltante' });
  }

  if (!referencia || typeof referencia !== 'string') {
    return res.status(400).json({ error: 'Referencia inválida o faltante' });
  }

  if (!vehiculoid || isNaN(parseInt(vehiculoid))) {
    return res.status(400).json({ error: 'vehiculoid inválido o faltante' });
  }

  if (!metodo || typeof metodo !== 'string') {
    return res.status(400).json({ error: 'Método de pago inválido o faltante' });
  }

  next();
};