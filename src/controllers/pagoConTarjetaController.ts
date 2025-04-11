//C:\Users\H P\Documents\IS 2025\PROYECTO IS 1_2025\RediBo_Back\src\controllers\pagoConTarjetaController.ts
import { Request, Response } from 'express';
import { crearPagoConTarjeta } from '../services/pagoConTarjetaService';  

export const crearPagoConTarjetaController = async (req: Request, res: Response) => {
    const { metodo, monto, referencia, estado, vehiculoid } = req.body;

    if (!metodo || !monto) {
        return res.status(400).json({ error: "Faltan parámetros obligatorios (metodo y monto)" });
    }

    try {
        const pago = await crearPagoConTarjeta(metodo, monto, referencia, estado, vehiculoid);
        return res.status(201).json({ mensaje: "Pago creado con éxito", pago });
    } catch (error) {
        return res.status(500).json({ error: "Error al procesar el pago" });
    }
};
