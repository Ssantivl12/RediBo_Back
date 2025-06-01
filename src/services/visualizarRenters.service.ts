import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const obtenerRentersDeDriver = async (idUsuario: number) => {
  const driver = await prisma.driver.findUnique({
    where: { idUsuario },
  });

  if (!driver) {
    throw new Error("Driver no encontrado");
  }

  const relaciones = await prisma.usuarioDriver.findMany({
    where: {
      idDriver: driver.idDriver, // ¡este es el id real del driver!
    },
    include: {
      usuario: true,
    },
  });

  return relaciones.map((rel) => ({
    fecha_suscripcion: rel.usuario.fechaRegistro,
    nombre: rel.usuario.nombreCompleto,
    telefono: rel.usuario.telefono || "",
    email: rel.usuario.email,
  }));
};
