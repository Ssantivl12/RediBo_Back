// controllers/reservaController.ts

import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

/**
 * Función para obtener los datos detallados de un auto a partir de una reserva
 */
async function detallesReservaAuto(idReserva: number) {
    try {
      // Buscar la reserva con todos los datos relacionados
      const reserva = await prisma.reserva.findUnique({
        where: {
          idReserva: idReserva,
        },
        include: {
          auto: {
            include: {
              propietario: true,
            }
          },
          cliente: true,
        },
      });
  
      if (!reserva) {
        throw new Error('Reserva no encontrada');
      }
  
      const auto = reserva.auto;
      const propietario = auto.propietario;
  
      // Cantidad de dias
      const diffTiempo = Math.abs(reserva.fechaFin.getTime() - reserva.fechaInicio.getTime());
      const dias = Math.ceil(diffTiempo / (1000 * 60 * 60 * 24));
      
      // formatear la fecha (formato: día mes año)
      const formatearFecha = (fecha: Date) => {
        const opciones: Intl.DateTimeFormatOptions = { 
          day: 'numeric', 
          month: 'short', 
          year: 'numeric' 
        };
        return fecha.toLocaleDateString('es-ES', opciones).toLowerCase();
      };
  
      // costos del auto
      const precioDiario = Number(auto.precioRentaDiario);
      const precioTotal = precioDiario * dias;
      const garantia = Number(auto.montoGarantia);
      const total = precioTotal + garantia;
  
      // Construir el objeto carData
      const carData = {
        titulo: `${auto.marca} ${auto.modelo}`,
        tipo: auto.tipo,
        año: auto.año.toString(),
        precio: precioDiario,
        propietario: `${propietario.nombre} ${propietario.apellido}`,
        calificacion: auto.calificacionPromedio || 0,
        comentarios: auto.totalComentarios,
        descripcion: auto.descripcion || '',
        asientos: auto.asientos,
        transmision: auto.transmision === 'AUTOMATICO' ? 'Automático' : 'Manual',
        reserva: {
          fechaInicio: formatearFecha(reserva.fechaInicio),
          fechaFin: formatearFecha(reserva.fechaFin),
          dias: dias
        },
        costes: {
          precio: precioDiario,
          dias: dias,
          tarifa: 14, // !aun no se sabe si esto habra
          garantia: garantia,
          total: total
        },
        imagenes: {
          galeria: []//auto.imagenes ? JSON.parse(auto.imagenes) : []
        }
      };
  
      return carData;
    } catch (error) {
      console.error('Error al obtener detalles de la reserva:', error);
      throw error;
    }
  }
  
  export const obtenerDetallesReservaAuto = async (req: Request, res: Response) => {
    try {
      const idReserva = parseInt(req.params.idReserva);
      
      // Verificamos que el ID sea un número válido
      if (isNaN(idReserva)) {
        return res.status(400).json({ 
          error: 'El ID de reserva debe ser un número válido' 
        });
      }
      
      // Llamamos a nuestra función para obtener los detalles
      const datosReserva = await detallesReservaAuto(idReserva);
      
      // Devolvemos los datos en formato JSON
      res.json(datosReserva);
    } catch (error: any) {
      console.error('Error al obtener detalles de reserva:', error);
      
      // Manejamos diferentes tipos de errores
      if (error.message === 'Reserva no encontrada') {
        return res.status(404).json({ error: 'Reserva no encontrada' });
      }
      
      res.status(500).json({ 
        error: 'Error al procesar la solicitud',
        mensaje: error.message 
      });
    }
  };