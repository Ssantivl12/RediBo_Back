import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type RegistroDriverResultado = void;
type DatosRegistro = {
  idUsuario: number;
  sexo: string;
  telefono: string;
  licencia: string;
  tipoLicencia: string;
  fechaEmision: Date;
  fechaExpiracion: Date;
  anversoUrl: string;
  reversoUrl: string;
  rentersIds: number[];
};
export const registrarDriverCompleto = async (data: DatosRegistro): Promise<RegistroDriverResultado> => { 
 {
  const {
    idUsuario,
    sexo,
    telefono,
    licencia,
    tipoLicencia,
    fechaEmision,
    fechaExpiracion,
    anversoUrl,
    reversoUrl,
    rentersIds
  } = data;

  if (!Array.isArray(rentersIds) || rentersIds.length === 0) {
  throw new Error('Debes asignar al menos un renter válido al driver.');
}
if (!sexo || !licencia || !tipoLicencia || !fechaEmision || !fechaExpiracion) {
  throw new Error('Faltan campos requeridos para registrar al driver.');
}


  const usuario = await prisma.usuario.findUnique({
    where: { idUsuario },
    select: { telefono: true }
  });

  const telefonoFinal = usuario?.telefono ? String(usuario.telefono) : telefono;

  return await prisma.$transaction(async (tx) => {
    // 1. Crear al driver y obtener su ID real
    const driver = await tx.driver.create({
      data: {
        idUsuario,
        sexo,
        telefono: telefonoFinal,
        licencia,
        tipoLicencia,
        fechaEmision,
        fechaExpiracion,
        anversoUrl,
        reversoUrl
      }
    });

    const existing = await prisma.driver.findUnique({ where: { idUsuario } });
      if (existing) {
        throw new Error('Este usuario ya está registrado como driver.');
      }


    // 2. Actualizar teléfono si no tenía
    if (!usuario?.telefono) {
      await tx.usuario.update({
        where: { idUsuario },
        data: { telefono: String(telefono) }
      });
    }

    // 3. Marcar al usuario como driver
    await tx.usuario.update({
      where: { idUsuario },
      data: { driverBool: true }
    });

    // 4. Validar que todos los renterIds existen
    const renters = await tx.usuario.findMany({
      where: {
        idUsuario: { in: rentersIds },
      }
    });

    if (renters.length !== rentersIds.length) {
      throw new Error("Uno o más renters no existen en la base de datos.");
    }

    const asignarRenters = async (tx: PrismaClient, driverId: number, rentersIds: number[]) => {
  await tx.usuarioDriver.createMany({
    data: rentersIds.map(idUsuario => ({
      idUsuario,
      idDriver: driverId,
      fechaAsignacion: new Date()
    })),
    skipDuplicates: true,
  });
};


    // 5. Registrar relaciones en UsuarioDriver
    const uniqueRenters = [...new Set(rentersIds)];
    if (uniqueRenters.length !== rentersIds.length) {
      throw new Error("Hay renterIds duplicados en la lista.");
    }

    await tx.usuarioDriver.createMany({
      data: uniqueRenters.map(renterId => ({
        idUsuario: renterId,
        idDriver: driver.idDriver,
        fechaAsignacion: new Date()
      })),
      skipDuplicates: true
    });
  });
};}