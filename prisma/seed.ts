import { PrismaClient } from '@prisma/client';
import { Decimal } from 'decimal.js';
const prisma = new PrismaClient();

async function main() {
  const usuario = await prisma.usuario.create({
    data: {
      nombreCompleto: "Juan Fernandez",
      email: "Juan@correo.com",
      contraseña: "host123",
      registradoCon: 'email',
      host: true,
      driverBool: false,
    }
  });
  const usuario1 = await prisma.usuario.create({
    data: {
      nombreCompleto: "Miguel Janco",
      email: "miguel@correo.com",
      contraseña: "host123",
      registradoCon: 'email',
      host: false,
      driverBool: true,
    }

  });
  const usuario2 = await prisma.usuario.create({
    data: {
      nombreCompleto: "María López",
      email: "maria@correo.com",
      contraseña: "maria123",
      registradoCon: 'email',
      host: true,
      driverBool: false,
    }
  });
  
  const usuario3 = await prisma.usuario.create({
    data: {
      nombreCompleto: "Carlos Ruiz",
      email: "carlos@correo.com",
      contraseña: "carlos123",
      registradoCon: 'email',
      host: false,
      driverBool: true,
    }
  });
  
  const usuario4 = await prisma.usuario.create({
    data: {
      nombreCompleto: "Ana García",
      email: "ana@correo.com",
      contraseña: "ana123",
      registradoCon: 'email',
      host: true,
      driverBool: false,
    }
  });
  
  const usuario5 = await prisma.usuario.create({
    data: {
      nombreCompleto: "Pedro Méndez",
      email: "pedro@correo.com",
      contraseña: "pedro123",
      registradoCon: 'email',
      host: false,
      driverBool: true,
    }
  });

  
  const usuario6 = await prisma.usuario.create({
    data: {
      nombreCompleto: "Lucía Torres",
      email: "lucia@correo.com",
      contraseña: "lucia123",
      registradoCon: 'email',
      host: true,
      driverBool: true,  // Usuario con ambos roles
    }
  });

  const renters = await Promise.all(
    Array.from({ length: 10 }, (_, i) =>
      prisma.usuario.create({
        data: {
          nombreCompleto: `Renter ${i + 1}`,
          email: `renter${i + 1}@correo.com`,
          registradoCon: 'email',
        },
      })
    )
  );

  
  const ubicacion1 = await prisma.ubicacion.create({
    data: {
      nombre: 'Sucursal Cochabamba',
      descripcion: 'Ubicación principal',
      latitud: -17.3925,
      longitud: -66.1570,
    }
    });

  const autos = await Promise.all([
    prisma.auto.create({ data: { marca: 'Toyota', modelo: 'Corolla', descripcion: 'Auto confiable y económico', precioRentaDiario: new Decimal(50.00), montoGarantia: new Decimal(300), kilometraje: 15000, tipo: 'Sedán', año: 2020, placa: 'DEF456', soat: 'SOAT-2025-002', color: 'Rojo', transmision: 'AUTOMATICO', combustible: 'GASOLINA', capacidadMaletero: 420, asientos: 5, idPropietario: usuario.idUsuario,  idUbicacion: ubicacion1.idUbicacion, imagenes:{ create: [{ direccionImagen: 'https://picsum.photos/200' }] }, } }),
    prisma.auto.create({ data: { marca: 'Honda', modelo: 'Civic', descripcion: 'Diseño elegante y potente', precioRentaDiario: new Decimal(55.00), montoGarantia: new Decimal(350), kilometraje: 15000, tipo: 'Sedán', año: 2020, placa: 'DEF496', soat: 'SOAT-2025-002', color: 'Azul', transmision: 'MANUAL', combustible: 'GASOLINA', capacidadMaletero: 420, asientos: 5, idPropietario: usuario1.idUsuario, idUbicacion: ubicacion1.idUbicacion, imagenes:{ create: [{ direccionImagen: 'https://picsum.photos/201' }] }, } }),
    prisma.auto.create({ data: { marca: 'Mazda', modelo: '3', descripcion: 'SUV espaciosa y cómoda', precioRentaDiario: new Decimal(70.00), montoGarantia: new Decimal(450), kilometraje: 18000, tipo: 'SUV', año: 2021, placa: 'GHI789', soat: 'SOAT-2025-003', color: 'Negro', transmision: 'AUTOMATICO', combustible: 'DIESEL', capacidadMaletero: 500, asientos: 7, idPropietario: usuario2.idUsuario, idUbicacion: ubicacion1.idUbicacion, imagenes: { create: [{ direccionImagen: 'https://picsum.photos/202' }] }, } }),
    prisma.auto.create({ data: { marca: 'Chevrolet', modelo: 'Onix', descripcion: 'Compacto y eficiente', precioRentaDiario: new Decimal(40.00), montoGarantia: new Decimal(250), kilometraje: 22000, tipo: 'Hatchback', año: 2018, placa: 'JKL012', soat: 'SOAT-2025-004', color: 'Gris', transmision: 'MANUAL', combustible: 'GASOLINA', capacidadMaletero: 350, asientos: 5, idPropietario: usuario3.idUsuario, idUbicacion: ubicacion1.idUbicacion, imagenes: { create: [{ direccionImagen: 'https://picsum.photos/203' }] } , } }),
  
    prisma.auto.create({ data: { marca: 'Ford', modelo: 'Focus', descripcion: 'Rendimiento y estilo', precioRentaDiario: new Decimal(60.00), montoGarantia: new Decimal(400), kilometraje: 17000, tipo: 'Sedán', año: 2019, placa: 'MNO345', soat: 'SOAT-2025-005', color: 'Blanco', transmision: 'AUTOMATICO', combustible: 'HIBRIDO', capacidadMaletero: 410, asientos: 5, idPropietario: usuario4.idUsuario, idUbicacion: ubicacion1.idUbicacion, imagenes: { create: [{ direccionImagen: 'https://picsum.photos/204' }] } ,} }),
    prisma.auto.create({ data: { marca: 'Volkswagen', modelo: 'Jetta', descripcion: 'Elegancia y confort', precioRentaDiario: new Decimal(65.00), montoGarantia: new Decimal(420), kilometraje: 16000, tipo: 'Sedán', año: 2020, placa: 'PQR678', soat: 'SOAT-2025-006', color: 'Verde', transmision: 'AUTOMATICO', combustible: 'GASOLINA', capacidadMaletero: 430, asientos: 5, idPropietario: usuario5.idUsuario, idUbicacion: ubicacion1.idUbicacion, imagenes: { create: [{ direccionImagen: 'https://picsum.photos/205' }] } ,} }),
    prisma.auto.create({ data: { marca: 'Hyundai', modelo: 'Elantra', descripcion: 'Tecnología y eficiencia', precioRentaDiario: new Decimal(58.00), montoGarantia: new Decimal(380), kilometraje: 14000, tipo: 'Sedán', año: 2019, placa: 'STU901', soat: 'SOAT-2025-007', color: 'Plateado', transmision: 'MANUAL', combustible: 'GASOLINA', capacidadMaletero: 400, asientos: 5, idPropietario: usuario6.idUsuario, idUbicacion: ubicacion1.idUbicacion, imagenes: { create: [{ direccionImagen: 'https://picsum.photos/206' }] } , } }),
    
  ]);
  await Promise.all([
    prisma.reserva.create({ data: { idAuto: autos[0].idAuto, idCliente: renters[0].idUsuario, fechaInicio: new Date('2025-03-01'), fechaFin: new Date('2025-03-03'), fechaLimitePago: new Date('2025-03-01'), montoTotal: 300.50, estado: 'SOLICITADA', estaPagada: false } }),
    prisma.reserva.create({ data: { idAuto: autos[0].idAuto, idCliente: renters[1].idUsuario, fechaInicio: new Date('2025-03-05'), fechaFin: new Date('2025-03-10'), fechaLimitePago: new Date('2025-03-02'), montoTotal: 250.75, estado: 'SOLICITADA', estaPagada: false } }),
    prisma.reserva.create({ data: { idAuto: autos[1].idAuto, idCliente: renters[2].idUsuario, fechaInicio: new Date('2025-03-12'), fechaFin: new Date('2025-03-15'), fechaLimitePago: new Date('2025-03-05'), montoTotal: 310.00, estado: 'SOLICITADA', estaPagada: false } }),
    prisma.reserva.create({ data: { idAuto: autos[2].idAuto, idCliente: renters[3].idUsuario, fechaInicio: new Date('2025-03-16'), fechaFin: new Date('2025-03-20'), fechaLimitePago: new Date('2025-03-10'), montoTotal: 199.99, estado: 'SOLICITADA', estaPagada: false } }),
    prisma.reserva.create({ data: { idAuto: autos[3].idAuto, idCliente: renters[4].idUsuario, fechaInicio: new Date('2025-03-22'), fechaFin: new Date('2025-03-25'), fechaLimitePago: new Date('2025-03-12'), montoTotal: 275.00, estado: 'SOLICITADA', estaPagada: false } }),
    prisma.reserva.create({ data: { idAuto: autos[3].idAuto, idCliente: renters[5].idUsuario, fechaInicio: new Date('2025-03-26'), fechaFin: new Date('2025-03-30'), fechaLimitePago: new Date('2025-03-14'), montoTotal: 330.45, estado: 'SOLICITADA', estaPagada: false } }),
    prisma.reserva.create({ data: { idAuto: autos[4].idAuto, idCliente: renters[6].idUsuario, fechaInicio: new Date('2025-04-01'), fechaFin: new Date('2025-04-03'), fechaLimitePago: new Date('2025-03-16'), montoTotal: 799.79, estado: 'SOLICITADA', estaPagada: false } }),
    prisma.reserva.create({ data: { idAuto: autos[5].idAuto, idCliente: renters[7].idUsuario, fechaInicio: new Date('2025-04-04'), fechaFin: new Date('2025-04-07'), fechaLimitePago: new Date('2025-03-20'), montoTotal: 136.29, estado: 'SOLICITADA', estaPagada: false } }),
    prisma.reserva.create({ data: { idAuto: autos[6].idAuto, idCliente: renters[8].idUsuario, fechaInicio: new Date('2025-04-08'), fechaFin: new Date('2025-04-10'), fechaLimitePago: new Date('2025-03-25'), montoTotal: 300.20, estado: 'SOLICITADA', estaPagada: false } }),
    prisma.reserva.create({ data: { idAuto: autos[6].idAuto, idCliente: renters[9].idUsuario, fechaInicio: new Date('2025-04-12'), fechaFin: new Date('2025-04-14'), fechaLimitePago: new Date('2025-03-26'), montoTotal: 345.07, estado: 'SOLICITADA', estaPagada: false } }),
    prisma.reserva.create({ data: { idAuto: autos[1].idAuto, idCliente: renters[0].idUsuario, fechaInicio: new Date('2025-04-15'), fechaFin: new Date('2025-04-17'), fechaLimitePago: new Date('2025-04-02'), montoTotal: 215.39, estado: 'SOLICITADA', estaPagada: false } }),
    prisma.reserva.create({ data: { idAuto: autos[2].idAuto, idCliente: renters[1].idUsuario, fechaInicio: new Date('2025-04-18'), fechaFin: new Date('2025-04-20'), fechaLimitePago: new Date('2025-04-09'), montoTotal: 312.55, estado: 'SOLICITADA', estaPagada: false } }),
    prisma.reserva.create({ data: { idAuto: autos[5].idAuto, idCliente: renters[2].idUsuario, fechaInicio: new Date('2025-04-21'), fechaFin: new Date('2025-04-25'), fechaLimitePago: new Date('2025-04-13'), montoTotal: 325.78, estado: 'SOLICITADA', estaPagada: false } }),
    prisma.reserva.create({ data: { idAuto: autos[0].idAuto, idCliente: renters[3].idUsuario, fechaInicio: new Date('2025-04-26'), fechaFin: new Date('2025-04-28'), fechaLimitePago: new Date('2025-04-16'), montoTotal: 189.99, estado: 'SOLICITADA', estaPagada: false } }),
    prisma.reserva.create({ data: { idAuto: autos[0].idAuto, idCliente: renters[4].idUsuario, fechaInicio: new Date('2025-04-29'), fechaFin: new Date('2025-05-01'), fechaLimitePago: new Date('2025-04-27'), montoTotal: 292.91, estado: 'SOLICITADA', estaPagada: false } }),
  ]);

  const comentarios = await Promise.all([
    prisma.comentario.create({ data: { idAuto: autos[1].idAuto, idUsuario: renters[2].idUsuario, contenido: "Es muy bueno", calificacion: 8, fechaCreacion: new Date('2025-04-30') } }),
    prisma.comentario.create({ data: { idAuto: autos[0].idAuto, idUsuario: renters[0].idUsuario, contenido: "Excelente servicio y auto muy limpio", calificacion: 9, fechaCreacion: new Date('2025-04-25') } }),
    prisma.comentario.create({ data: { idAuto: autos[2].idAuto, idUsuario: renters[4].idUsuario, contenido: "Buena experiencia, lo recomiendo", calificacion: 7, fechaCreacion: new Date('2025-04-28') } }),
    prisma.comentario.create({ data: { idAuto: autos[3].idAuto, idUsuario: renters[1].idUsuario, contenido: "Auto cómodo para viajes largos", calificacion: 8, fechaCreacion: new Date('2025-04-20') } }),
    prisma.comentario.create({ data: { idAuto: autos[4].idAuto, idUsuario: renters[3].idUsuario, contenido: "Muy buen rendimiento de combustible", calificacion: 9, fechaCreacion: new Date('2025-04-15') } }),
  ]);

  const disponibilidades = await Promise.all([
    prisma.disponibilidad.create({ data: { idAuto: autos[0].idAuto, fechaInicio: new Date('2025-06-01'), fechaFin: new Date('2025-06-05'), motivo: 'MANTENIMIENTO', descripcion: 'Revisión general del motor' } }),
    prisma.disponibilidad.create({ data: { idAuto: autos[1].idAuto, fechaInicio: new Date('2025-06-10'), fechaFin: new Date('2025-06-12'), motivo: 'REPARACION', descripcion: 'Cambio de frenos' } }),
    prisma.disponibilidad.create({ data: { idAuto: autos[2].idAuto, fechaInicio: new Date('2025-06-15'), fechaFin: new Date('2025-06-20'), motivo: 'USO_PERSONAL', descripcion: 'Uso personal del propietario' } }),
    prisma.disponibilidad.create({ data: { idAuto: autos[3].idAuto, fechaInicio: new Date('2025-06-25'), fechaFin: new Date('2025-06-27'), motivo: 'MANTENIMIENTO', descripcion: 'Cambio de aceite y filtros' } }),
    prisma.disponibilidad.create({ data: { idAuto: autos[4].idAuto, fechaInicio: new Date('2025-07-01'), fechaFin: new Date('2025-07-03'), motivo: 'REPARACION', descripcion: 'Reparación del sistema de aire acondicionado' } }),
    prisma.disponibilidad.create({ data: { idAuto: autos[5].idAuto, fechaInicio: new Date('2025-07-08'), fechaFin: new Date('2025-07-10'), motivo: 'USO_PERSONAL', descripcion: 'Viaje familiar' } }),
    prisma.disponibilidad.create({ data: { idAuto: autos[6].idAuto, fechaInicio: new Date('2025-07-15'), fechaFin: new Date('2025-07-18'), motivo: 'MANTENIMIENTO', descripcion: 'Inspección técnica vehicular' } }),
  ]);
  const drivers = await Promise.all([
    prisma.driver.create({ data: { idUsuario: usuario1.idUsuario, sexo: 'M', telefono: '70123456', licencia: 'LIC001234', fechaEmision: new Date('2020-01-15'), fechaExpiracion: new Date('2030-01-15'), tipoLicencia: 'Categoria A', añosExperiencia: 8, disponible: true, anversoUrl: 'https://picsum.photos/300/200', reversoUrl: 'https://picsum.photos/300/201' } }),
    prisma.driver.create({ data: { idUsuario: usuario3.idUsuario, sexo: 'M', telefono: '70234567', licencia: 'LIC002345', fechaEmision: new Date('2019-03-20'), fechaExpiracion: new Date('2029-03-20'), tipoLicencia: 'Categoria B', añosExperiencia: 12, disponible: true, anversoUrl: 'https://picsum.photos/300/202', reversoUrl: 'https://picsum.photos/300/203' } }),
    prisma.driver.create({ data: { idUsuario: usuario5.idUsuario, sexo: 'M', telefono: '70345678', licencia: 'LIC003456', fechaEmision: new Date('2021-06-10'), fechaExpiracion: new Date('2031-06-10'), tipoLicencia: 'Categoria A', añosExperiencia: 5, disponible: true, anversoUrl: 'https://picsum.photos/300/204', reversoUrl: 'https://picsum.photos/300/205' } }),
    prisma.driver.create({ data: { idUsuario: usuario6.idUsuario, sexo: 'F', telefono: '70456789', licencia: 'LIC004567', fechaEmision: new Date('2018-11-25'), fechaExpiracion: new Date('2028-11-25'), tipoLicencia: 'Categoria B', añosExperiencia: 15, disponible: false, anversoUrl: 'https://picsum.photos/300/206', reversoUrl: 'https://picsum.photos/300/207' } }),
  ]);
  const garantias = await Promise.all([
    prisma.garantia.create({ data: { idReserva: 1, monto: new Decimal(300.00), fechaDeposito: new Date('2025-02-28'), estado: 'DEPOSITADA', comprobante: 'COMP-001234' } }),
    prisma.garantia.create({ data: { idReserva: 2, monto: new Decimal(350.00), fechaDeposito: new Date('2025-03-01'), estado: 'DEPOSITADA', comprobante: 'COMP-001235' } }),
    prisma.garantia.create({ data: { idReserva: 3, monto: new Decimal(450.00), fechaDeposito: new Date('2025-03-04'), estado: 'LIBERADA', fechaLiberacion: new Date('2025-03-16'), comprobante: 'COMP-001236' } }),
    prisma.garantia.create({ data: { idReserva: 4, monto: new Decimal(250.00), fechaDeposito: new Date('2025-03-09'), estado: 'DEPOSITADA', comprobante: 'COMP-001237' } }),
    prisma.garantia.create({ data: { idReserva: 5, monto: new Decimal(400.00), fechaDeposito: new Date('2025-03-11'), estado: 'LIBERADA', fechaLiberacion: new Date('2025-03-26'), comprobante: 'COMP-001238' } }),
    prisma.garantia.create({ data: { idReserva: 6, monto: new Decimal(420.00), fechaDeposito: new Date('2025-03-13'), estado: 'DEPOSITADA', comprobante: 'COMP-001239' } }),
    prisma.garantia.create({ data: { idReserva: 7, monto: new Decimal(380.00), fechaDeposito: new Date('2025-03-15'), estado: 'DEPOSITADA', comprobante: 'COMP-001240' } }),
  ]);
  const notificaciones = await Promise.all([

    prisma.notificacion.create({ data: { idUsuario: usuario.idUsuario, titulo: 'Nueva reserva recibida', mensaje: 'Has recibido una nueva solicitud de reserva', idEntidad: '1', tipoEntidad: 'RESERVA', leido: true, leidoEn: new Date('2025-03-02'), tipo: 'RESERVA_RECHAZADA', prioridad: 'MEDIA' } }),
    prisma.notificacion.create({ data: { idUsuario: renters[1].idUsuario, titulo: 'Recordatorio de pago', mensaje: 'Tu pago vence mañana, no olvides realizarlo', idEntidad: '2', tipoEntidad: 'PAGO', leido: false, tipo: 'RESERVA_CANCELADA', prioridad: 'ALTA' } }),
    prisma.notificacion.create({ data: { idUsuario: usuario2.idUsuario, titulo: 'Mantenimiento programado', mensaje: 'Se ha programado mantenimiento para tu vehículo', idEntidad: '3', tipoEntidad: 'MANTENIMIENTO', leido: false, tipo: 'RESERVA_MODIFICADA', prioridad: 'MEDIA' } }),
    prisma.notificacion.create({ data: { idUsuario: renters[2].idUsuario, titulo: 'Reserva cancelada', mensaje: 'Lamentablemente tu reserva ha sido cancelada', idEntidad: '3', tipoEntidad: 'RESERVA', leido: true, leidoEn: new Date('2025-03-10'), tipo: 'RESERVA_CANCELADA', prioridad: 'ALTA' } }),
    prisma.notificacion.create({ data: { idUsuario: usuario3.idUsuario, titulo: 'Comentario recibido', mensaje: 'Has recibido un nuevo comentario en tu vehículo', idEntidad: '1', tipoEntidad: 'COMENTARIO', leido: false, tipo: 'DEPOSITO_CONFIRMADO', prioridad: 'BAJA' } }),
    prisma.notificacion.create({ data: { idUsuario: renters[3].idUsuario, titulo: 'Bienvenido', mensaje: 'Bienvenido a nuestra plataforma de alquiler de vehículos', leido: false, tipo: 'RESERVA_CANCELADA', prioridad: 'BAJA' } }),
    prisma.notificacion.create({ data: { idUsuario: usuario4.idUsuario, titulo: 'Garantía liberada', mensaje: 'La garantía de tu reserva ha sido liberada', idEntidad: '5', tipoEntidad: 'GARANTIA', leido: true, leidoEn: new Date('2025-03-26'), tipo: 'RESERVA_MODIFICADA', prioridad: 'MEDIA', haSidoBorrada: true } }),
    prisma.notificacion.create({ data: { idUsuario: renters[3].idUsuario, titulo: 'Retraso en devolución', mensaje: 'Has excedido el tiempo acordado para la devolución del vehículo. Se han aplicado cargos por tiempo extra.', idEntidad: '4', tipoEntidad: 'RESERVA', leido: true, leidoEn: new Date('2025-03-22'), tipo: 'TIEMPO_EXCEDIDO_DEVOLUCION', prioridad: 'ALTA' } }),
  prisma.notificacion.create({ data: { idUsuario: renters[0].idUsuario, titulo: 'Devolución tardía detectada', mensaje: 'Tu reserva venció hace 2 horas. Por favor devuelve el vehículo lo antes posible para evitar cargos adicionales.', idEntidad: '1', tipoEntidad: 'RESERVA', leido: false, tipo: 'TIEMPO_EXCEDIDO_DEVOLUCION', prioridad: 'ALTA' } }),
  prisma.notificacion.create({ data: { idUsuario: renters[1].idUsuario, titulo: 'Tiempo de renta excedido', mensaje: 'Has superado el tiempo acordado de devolución por 4 horas. Se aplicará una tarifa de $15 por hora adicional.', idEntidad: '2', tipoEntidad: 'RESERVA', leido: true, leidoEn: new Date('2025-03-12'), tipo: 'TIEMPO_EXCEDIDO_DEVOLUCION', prioridad: 'ALTA' } }),
  prisma.notificacion.create({ data: { idUsuario: renters[2].idUsuario, titulo: 'Urgente: Devolución pendiente', mensaje: 'Llevas 6 horas de retraso en la devolución del vehículo Toyota Corolla. Contacta al propietario inmediatamente.', idEntidad: '11', tipoEntidad: 'RESERVA', leido: false, tipo: 'TIEMPO_EXCEDIDO_DEVOLUCION', prioridad: 'ALTA' } }),
  prisma.notificacion.create({ data: { idUsuario: renters[4].idUsuario, titulo: 'Cargo por tiempo extra aplicado', mensaje: 'Se ha aplicado un cargo de $45 por exceder 3 horas el tiempo de devolución del Honda Civic.', idEntidad: '15', tipoEntidad: 'RESERVA', leido: true, leidoEn: new Date('2025-05-02'), tipo: 'TIEMPO_EXCEDIDO_DEVOLUCION', prioridad: 'MEDIA' } }),
  prisma.notificacion.create({ data: { idUsuario: renters[5].idUsuario, titulo: 'Retraso significativo en devolución', mensaje: 'Tu reserva del Mazda 3 debió terminar ayer. Por favor devuelve el vehículo hoy para evitar penalizaciones mayores.', idEntidad: '6', tipoEntidad: 'RESERVA', leido: false, tipo: 'TIEMPO_EXCEDIDO_DEVOLUCION', prioridad: 'ALTA' } }),
  prisma.notificacion.create({ data: { idUsuario: renters[6].idUsuario, titulo: '24 horas de retraso', mensaje: 'Llevas un día completo de retraso en la devolución del Ford Focus. Se han aplicado cargos por día completo.', idEntidad: '7', tipoEntidad: 'RESERVA', leido: true, leidoEn: new Date('2025-04-05'), tipo: 'TIEMPO_EXCEDIDO_DEVOLUCION', prioridad: 'ALTA' } }),
  prisma.notificacion.create({ data: { idUsuario: renters[7].idUsuario, titulo: 'Tiempo excedido - Última advertencia', mensaje: 'Esta es tu última advertencia. Devuelve el Volkswagen Jetta en las próximas 2 horas o se reportará como falta grave.', idEntidad: '8', tipoEntidad: 'RESERVA', leido: false, tipo: 'TIEMPO_EXCEDIDO_DEVOLUCION', prioridad: 'ALTA' } }),
  prisma.notificacion.create({ data: { idUsuario: renters[8].idUsuario, titulo: 'Multa por retraso aplicada', mensaje: 'Se ha aplicado una multa de $30 por exceder 2 horas el tiempo de devolución del Hyundai Elantra.', idEntidad: '9', tipoEntidad: 'RESERVA', leido: true, leidoEn: new Date('2025-04-11'), tipo: 'TIEMPO_EXCEDIDO_DEVOLUCION', prioridad: 'MEDIA' } }),
  prisma.notificacion.create({ data: { idUsuario: renters[9].idUsuario, titulo: 'Devolución fuera de horario', mensaje: 'Tu reserva terminó a las 18:00 pero aún tienes el vehículo. Los cargos nocturnos aplican después de las 22:00.', idEntidad: '10', tipoEntidad: 'RESERVA', leido: false, tipo: 'TIEMPO_EXCEDIDO_DEVOLUCION', prioridad: 'MEDIA' } }),
  prisma.notificacion.create({ data: { idUsuario: renters[0].idUsuario, titulo: 'Penalización por retraso', mensaje: 'Se aplicó una penalización de $60 por devolver el vehículo 8 horas tarde. Revisa tu facturación.', idEntidad: '12', tipoEntidad: 'RESERVA', leido: true, leidoEn: new Date('2025-04-18'), tipo: 'TIEMPO_EXCEDIDO_DEVOLUCION', prioridad: 'MEDIA' } }),
  prisma.notificacion.create({ data: { idUsuario: renters[1].idUsuario, titulo: 'Recordatorio urgente de devolución', mensaje: 'Tu tiempo de renta venció hace 30 minutos. Devuelve el Chevrolet Onix antes de que se apliquen cargos.', idEntidad: '13', tipoEntidad: 'RESERVA', leido: false, tipo: 'TIEMPO_EXCEDIDO_DEVOLUCION', prioridad: 'ALTA' } }),
  prisma.notificacion.create({ data: { idUsuario: renters[2].idUsuario, titulo: 'Cargo automático aplicado', mensaje: 'Se debitó automáticamente $25 de tu tarjeta por exceder 90 minutos el tiempo de devolución.', idEntidad: '14', tipoEntidad: 'RESERVA', leido: true, leidoEn: new Date('2025-04-22'), tipo: 'TIEMPO_EXCEDIDO_DEVOLUCION', prioridad: 'MEDIA' } })
  ]);
  const pagos = await Promise.all([
    prisma.pago.create({ data: { idReserva: 1, monto: new Decimal(300.50), fechaPago: new Date('2025-02-28'), metodoPago: 'TARJETA_DEBITO', referencia: 'TXN001234567', comprobante: 'COMP-PAG-001', tipo: 'RENTA' } }),
    prisma.pago.create({ data: { idReserva: 2, monto: new Decimal(250.75), fechaPago: new Date('2025-03-01'), metodoPago: 'QR', referencia: 'QR789012345', comprobante: 'COMP-PAG-002', tipo: 'RENTA' } }),
    prisma.pago.create({ data: { idReserva: 3, monto: new Decimal(310.00), fechaPago: new Date('2025-03-04'), metodoPago: 'EFECTIVO', referencia: 'TRF456789012', comprobante: 'COMP-PAG-003', tipo: 'RENTA' } }),
    prisma.pago.create({ data: { idReserva: 4, monto: new Decimal(199.99), fechaPago: new Date('2025-03-09'), metodoPago: 'EFECTIVO', comprobante: 'COMP-PAG-004', tipo: 'RENTA' } }),
    prisma.pago.create({ data: { idReserva: 5, monto: new Decimal(275.00), fechaPago: new Date('2025-03-11'), metodoPago: 'TARJETA_DEBITO', referencia: 'DEB123456789', comprobante: 'COMP-PAG-005', tipo: 'RENTA' } }),
    prisma.pago.create({ data: { idReserva: 1, monto: new Decimal(300.00), fechaPago: new Date('2025-02-28'), metodoPago: 'TARJETA_DEBITO', referencia: 'TXN001234568', comprobante: 'COMP-GAR-001', tipo: 'GARANTIA' } }),
    prisma.pago.create({ data: { idReserva: 6, monto: new Decimal(330.45), fechaPago: new Date('2025-03-13'), metodoPago: 'QR', referencia: 'QR890123456', comprobante: 'COMP-PAG-006', tipo: 'RENTA' } }),
    prisma.pago.create({ data: { idReserva: 7, monto: new Decimal(799.79), fechaPago: new Date('2025-03-15'), metodoPago: 'QR', referencia: 'TRF567890123', comprobante: 'COMP-PAG-007', tipo: 'RENTA' } }),
  ]);
  const terminosCondiciones = await Promise.all([
    prisma.terminosCondiciones.create({ data: { idUsuario: usuario.idUsuario, versionTerminos: 'v1.0', fechaAceptacion: new Date('2025-01-15') } }),
    prisma.terminosCondiciones.create({ data: { idUsuario: usuario1.idUsuario, versionTerminos: 'v1.0', fechaAceptacion: new Date('2025-01-20') } }),
    prisma.terminosCondiciones.create({ data: { idUsuario: usuario2.idUsuario, versionTerminos: 'v1.1', fechaAceptacion: new Date('2025-02-05') } }),
    prisma.terminosCondiciones.create({ data: { idUsuario: usuario3.idUsuario, versionTerminos: 'v1.0', fechaAceptacion: new Date('2025-01-25') } }),
    prisma.terminosCondiciones.create({ data: { idUsuario: usuario4.idUsuario, versionTerminos: 'v1.1', fechaAceptacion: new Date('2025-02-10') } }),
    prisma.terminosCondiciones.create({ data: { idUsuario: usuario5.idUsuario, versionTerminos: 'v1.0', fechaAceptacion: new Date('2025-01-30') } }),
    prisma.terminosCondiciones.create({ data: { idUsuario: usuario6.idUsuario, versionTerminos: 'v1.2', fechaAceptacion: new Date('2025-03-01') } }),
    prisma.terminosCondiciones.create({ data: { idUsuario: renters[0].idUsuario, versionTerminos: 'v1.1', fechaAceptacion: new Date('2025-02-15') } }),
    prisma.terminosCondiciones.create({ data: { idUsuario: renters[1].idUsuario, versionTerminos: 'v1.2', fechaAceptacion: new Date('2025-03-05') } }),
    prisma.terminosCondiciones.create({ data: { idUsuario: renters[2].idUsuario, versionTerminos: 'v1.1', fechaAceptacion: new Date('2025-02-20') } }),
  ]);

  
const usuarioDrivers = await Promise.all([
  prisma.usuarioDriver.create({ data: { idUsuario: usuario1.idUsuario, idDriver: drivers[0].idDriver, fechaAsignacion: new Date('2025-01-15') } }),
  prisma.usuarioDriver.create({ data: { idUsuario: usuario3.idUsuario, idDriver: drivers[1].idDriver, fechaAsignacion: new Date('2025-01-20') } }),
  prisma.usuarioDriver.create({ data: { idUsuario: usuario5.idUsuario, idDriver: drivers[2].idDriver, fechaAsignacion: new Date('2025-01-25') } }),
  prisma.usuarioDriver.create({ data: { idUsuario: usuario6.idUsuario, idDriver: drivers[3].idDriver, fechaAsignacion: new Date('2025-02-01') } }),
  prisma.usuarioDriver.create({ data: { idUsuario: renters[0].idUsuario, idDriver: drivers[0].idDriver, fechaAsignacion: new Date('2025-02-10') } }),
  prisma.usuarioDriver.create({ data: { idUsuario: renters[1].idUsuario, idDriver: drivers[1].idDriver, fechaAsignacion: new Date('2025-02-15') } }),
  prisma.usuarioDriver.create({ data: { idUsuario: renters[2].idUsuario, idDriver: drivers[2].idDriver, fechaAsignacion: new Date('2025-02-20') } }),
]);

const verificaciones = await Promise.all([
  prisma.verificaciones.create({ data: { idUsuario: usuario.idUsuario, codigo: '123456', tipo: 'recuperacion', creadoEn: new Date('2025-01-15'), expiracion: new Date('2025-01-15T10:15:00'), usado: true } }),
  prisma.verificaciones.create({ data: { idUsuario: usuario1.idUsuario, codigo: '234567', tipo: 'verificacion', creadoEn: new Date('2025-01-20'), expiracion: new Date('2025-01-20T11:20:00'), usado: true } }),
  prisma.verificaciones.create({ data: { idUsuario: usuario2.idUsuario, codigo: '345678', tipo: 'recuperacion', creadoEn: new Date('2025-02-05'), expiracion: new Date('2025-02-05T14:05:00'), usado: false } }),
  prisma.verificaciones.create({ data: { idUsuario: usuario3.idUsuario, codigo: '456789', tipo: 'recuperacion', creadoEn: new Date('2025-01-25'), expiracion: new Date('2025-01-25T16:25:00'), usado: true } }),
  prisma.verificaciones.create({ data: { idUsuario: usuario4.idUsuario, codigo: '567890', tipo: 'recuperacion', creadoEn: new Date('2025-02-10'), expiracion: new Date('2025-02-10T09:10:00'), usado: false } }),
  prisma.verificaciones.create({ data: { idUsuario: usuario5.idUsuario, codigo: '678901', tipo: 'verificacion', creadoEn: new Date('2025-01-30'), expiracion: new Date('2025-01-30T12:30:00'), usado: true } }),
  prisma.verificaciones.create({ data: { idUsuario: usuario6.idUsuario, codigo: '789012', tipo: 'verificacion', creadoEn: new Date('2025-03-01'), expiracion: new Date('2025-03-01T15:01:00'), usado: true } }),
  prisma.verificaciones.create({ data: { idUsuario: renters[0].idUsuario, codigo: '890123', tipo: 'recuperacion', creadoEn: new Date('2025-02-15'), expiracion: new Date('2025-02-15T08:15:00'), usado: true } }),
  prisma.verificaciones.create({ data: { idUsuario: renters[1].idUsuario, codigo: '901234', tipo: 'recuperacion', creadoEn: new Date('2025-03-05'), expiracion: new Date('2025-03-05T17:05:00'), usado: false } }),
  prisma.verificaciones.create({ data: { idUsuario: renters[2].idUsuario, codigo: '012345', tipo: 'verificacion', creadoEn: new Date('2025-02-20'), expiracion: new Date('2025-02-20T13:20:00'), usado: true } }),
  prisma.verificaciones.create({ data: { idUsuario: renters[3].idUsuario, codigo: '111222', tipo: 'recuperacion', creadoEn: new Date('2025-03-10'), expiracion: new Date('2025-03-10T10:30:00'), usado: false } }),
  prisma.verificaciones.create({ data: { idUsuario: renters[4].idUsuario, codigo: '333444', tipo: 'recuperacion', creadoEn: new Date('2025-03-15'), expiracion: new Date('2025-03-15T14:45:00'), usado: false } }),
]);

const calificacionesUsuarios = await Promise.all([
  prisma.calificacionUsuario.create({ data: { idCalificador: renters[0].idUsuario, idCalificado: usuario.idUsuario, puntuacion: 5, comentario: "Excelente host, muy responsable", fechaCreacion: new Date('2025-03-04'), idReserva: 1, tipoCalificacion: 'ARRENDADOR' } }),
  prisma.calificacionUsuario.create({ data: { idCalificador: usuario.idUsuario, idCalificado: renters[0].idUsuario, puntuacion: 4, comentario: "Buen cliente, cuidó bien el auto", fechaCreacion: new Date('2025-03-04'), idReserva: 7, tipoCalificacion: 'ARRENDATARIO' } }),
  prisma.calificacionUsuario.create({ data: { idCalificador: renters[1].idUsuario, idCalificado: usuario.idUsuario, puntuacion: 5, comentario: "Muy amable y puntual", fechaCreacion: new Date('2025-03-11'), idReserva: 2, tipoCalificacion: 'ARRENDADOR' } }),
  prisma.calificacionUsuario.create({ data: { idCalificador: usuario.idUsuario, idCalificado: renters[1].idUsuario, puntuacion: 3, comentario: "Cliente regular, sin problemas", fechaCreacion: new Date('2025-03-11'), idReserva: 8, tipoCalificacion: 'ARRENDADOR' } }),
  prisma.calificacionUsuario.create({ data: { idCalificador: renters[2].idUsuario, idCalificado: usuario1.idUsuario, puntuacion: 4, comentario: "Buen servicio como driver", fechaCreacion: new Date('2025-03-16'), idReserva: 3, tipoCalificacion: 'ARRENDADOR' } }),
  prisma.calificacionUsuario.create({ data: { idCalificador: usuario1.idUsuario, idCalificado: renters[2].idUsuario, puntuacion: 5, comentario: "Cliente muy educado y respetuoso", fechaCreacion: new Date('2025-03-16'), idReserva: 9, tipoCalificacion: 'ARRENDATARIO' } }),
  prisma.calificacionUsuario.create({ data: { idCalificador: renters[3].idUsuario, idCalificado: usuario2.idUsuario, puntuacion: 5, comentario: "Host muy profesional", fechaCreacion: new Date('2025-03-21'), idReserva: 4, tipoCalificacion: 'ARRENDADOR' } }),
  prisma.calificacionUsuario.create({ data: { idCalificador: usuario2.idUsuario, idCalificado: renters[3].idUsuario, puntuacion: 4, comentario: "Todo bien con el cliente", fechaCreacion: new Date('2025-03-21'), idReserva: 10, tipoCalificacion: 'ARRENDADOR' } }),
  prisma.calificacionUsuario.create({ data: { idCalificador: renters[4].idUsuario, idCalificado: usuario3.idUsuario, puntuacion: 3, comentario: "Servicio aceptable como driver", fechaCreacion: new Date('2025-03-26'), idReserva: 5, tipoCalificacion: 'ARRENDADOR' } }),
  prisma.calificacionUsuario.create({ data: { idCalificador: usuario3.idUsuario, idCalificado: renters[4].idUsuario, puntuacion: 4, comentario: "Cliente puntual y ordenado", fechaCreacion: new Date('2025-03-26'), idReserva: 11, tipoCalificacion: 'ARRENDATARIO' } }),
  prisma.calificacionUsuario.create({ data: { idCalificador: renters[5].idUsuario, idCalificado: usuario3.idUsuario, puntuacion: 4, comentario: "Buen host, auto en excelente estado", fechaCreacion: new Date('2025-03-31'), idReserva: 6, tipoCalificacion: 'ARRENDATARIO' } }),
  prisma.calificacionUsuario.create({ data: { idCalificador: usuario3.idUsuario, idCalificado: renters[5].idUsuario, puntuacion: 5, comentario: "Excelente cliente, muy recomendado", fechaCreacion: new Date('2025-03-31'), idReserva: 12, tipoCalificacion: 'ARRENDADOR' } }),
]);
  
  



  console.log("✅ Usuario creado:", usuario);
}


main()
  .catch((e) => {
    console.error('❌ Error:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
