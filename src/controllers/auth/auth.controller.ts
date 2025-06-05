import { PrismaClient, Usuario } from "@prisma/client";
import { Request, Response } from "express";
import * as authService from "../../services/auth/auth.service";
import { generateToken } from "../../utils/auth/generateToken";

import { SSEInitializerService } from "../../services/notificaciones/sse-initializer.service";

import { updateGoogleProfile as updateGoogleProfileService } from "../../services/auth/auth.service";

const prisma = new PrismaClient();
const sseInitializer = SSEInitializerService.getInstance();

export const register = async (req: Request, res: Response): Promise<void> => {
  const { nombreCompleto, email, contraseña, fechaNacimiento, telefono } =
    req.body;

  try {
    const existingUser = await authService.findUserByEmail(email);
    if (existingUser) {
      res
        .status(400)
        .json({ message: "El correo electrónico ya está registrado." });
    }

    const newUser = await authService.createUser({
      nombreCompleto,
      email,
      contraseña,
      fechaNacimiento,
      telefono,
    });

    res.status(201).json({
      message: "Usuario registrado exitosamente",
      user: { email: newUser.email },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};
  
export const updateGoogleProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  console.log("📍 REQ.USER:", req.user);
  const { nombreCompleto, fechaNacimiento, telefono } = req.body;
  const email = (req.user as { email: string }).email;

  if (!email) {
    res.status(401).json({ message: "Usuario no autenticado" });
  }

  try {
    const updatedUser = await authService.updateGoogleProfile(
      email,
      nombreCompleto,
      fechaNacimiento,
      telefono
    );
    res.json({
      message: "Perfil actualizado correctamente",
      user: updatedUser,
    });
  } catch (error: any) {
    console.error("Error al actualizar perfil:", error);
    res.status(400).json({
      message: error.message || "No se pudo actualizar el perfil con Google",
    });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const user = await authService.findUserByEmail(email);

    if (!user) {
      res.status(401).json({ message: "Correo ingresado no se encuentra en el sistema." });
      return;
    }

    const isValid = await authService.validatePassword(password, user.contraseña ?? "");

    if (!isValid) {
      res.status(401).json({ message: "Los datos no son válidos" });
      return;
    }

    // Si tiene 2FA activado, no enviar el token completo aún
    if (user.verificacionDosPasos) {
      // Generar un token temporal solo para verificar 2FA
      const tempToken = generateToken({
        idUsuario: user.idUsuario,
        email: user.email,
        nombreCompleto: user.nombreCompleto,
        temp2FA: true // Marcador para indicar que es temporal
      });

      res.json({
        message: "Requiere verificación 2FA",
        requires2FA: true,
        tempToken, // Token temporal para el proceso 2FA
        user: {
          email: user.email,
          nombreCompleto: user.nombreCompleto,
        }
      });
      return;
    }

    // Login normal sin 2FA - Generar token completo
    const token = generateToken({
      idUsuario: user.idUsuario,
      email: user.email,
      nombreCompleto: user.nombreCompleto,
    });

    sseInitializer.inicializarSSEParaUsuario(user.idUsuario);

    res.json({
      message: "Login exitoso",
      requires2FA: false,
      token,
      user: {
        email: user.email,
        nombreCompleto: user.nombreCompleto,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};


export const me = async (req: Request, res: Response): Promise<void> => {
  const { idUsuario } = req.user as { idUsuario: number };

  try {
    const user = await prisma.usuario.findUnique({
      where: { idUsuario },
      select: {
        idUsuario: true,
        nombreCompleto: true,
        email: true,
        telefono: true,
        fechaNacimiento: true,
        fotoPerfil: true,

        edicionesNombre: true,
        edicionesTelefono: true,
        edicionesFecha: true,
        driverBool: true,
        host: true,
        verificacionDosPasos: true,
      },
    });

    if (!user) {
      res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json({ user }); // 🔥 Ahora manda todos los datos al frontend
  } catch (error) {
    console.error('Error en /me:', error);
     res.status(500).json({ message: 'Error en el servidor' });
  }
};

export const updateUserField = async (req: Request, res: Response) => {
  const { campo, valor }: { campo: CampoEditable; valor: string } = req.body;
  const { idUsuario } = req.user as { idUsuario: number };

  if (!campo || !valor) {
    res.status(400).json({ message: "Campo y valor son obligatorios." });
  }

  const camposPermitidos = [
    "nombreCompleto",
    "telefono",
    "fechaNacimiento",
  ] as const;
  type CampoEditable = (typeof camposPermitidos)[number];
  if (!camposPermitidos.includes(campo)) {
    res.status(400).json({ message: "Campo no permitido." });
  }

  const campoContadorMap: Record<CampoEditable, keyof Usuario> = {
    nombreCompleto: "edicionesNombre",
    telefono: "edicionesTelefono",
    fechaNacimiento: "edicionesFecha",
  };
  const campoContador = campoContadorMap[campo];

  try {
    const user = (await prisma.usuario.findUnique({
      where: { idUsuario },
      select: {
        [campo]: true,
        [campoContador]: true,
      },
    })) as any;

    if (!user) {
      res.status(404).json({ message: "Usuario no encontrado" });
    }

    if (user[campoContador] >= 3) {
      res.status(403).json({
        message:
          "Has alcanzado el límite de 3 ediciones para este campo. Para más cambios, contacta al soporte.",
      });
    }

    const valorActual = user[campo];
    const nuevoValor =
      campo === "telefono"
        ? valor.trim()
        : campo === "fechaNacimiento"
        ? new Date(valor)
        : valor;

    if (valorActual?.toString() === nuevoValor?.toString()) {
      res.status(200).json({
        message: "No hubo cambios en el valor.",
        edicionesRestantes: 3 - user[campoContador],
      });
    }

    // Validaciones personalizadas
    if (campo === "nombreCompleto") {
      if (typeof valor !== "string" || valor.length < 3 || valor.length > 50) {
        res
          .status(400)
          .json({ message: "El nombre debe tener entre 3 y 50 caracteres." });
      }
      const soloLetrasRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/;
      if (!soloLetrasRegex.test(valor)) {
        res.status(400).json({
          message: "El nombre solo puede contener letras y espacios.",
        });
      }
      if (/\s{2,}/.test(valor)) {
        res.status(400).json({
          message: "El nombre no debe tener más de un espacio consecutivo.",
        });
      }
      if (/^\s|\s$/.test(valor)) {
        res.status(400).json({
          message: "El nombre no debe comenzar ni terminar con espacios.",
        });
      }
    }

    if (campo === "telefono") {
      const telefonoStr = valor.toString();
      if (!/^[0-9]*$/.test(telefonoStr)) {
        res
          .status(400)
          .json({ message: "Formato inválido, ingrese solo números." });
      }
      if (!/^[0-9]{8}$/.test(telefonoStr)) {
        res
          .status(400)
          .json({ message: "El teléfono debe ser un número de 8 dígitos." });
      }
      if (!/^[67]/.test(telefonoStr)) {
        res
          .status(400)
          .json({ message: "El teléfono debe comenzar con 6 o 7." });
      }
    }
    if (campo === "fechaNacimiento") {
      const fechaValida = Date.parse(valor);
      if (isNaN(fechaValida)) {
        res.status(400).json({ message: "Fecha inválida." });
      }
    }

    const updatedUser = await prisma.usuario.update({
      where: { idUsuario },
      data: {
        [campo]: nuevoValor,
        [campoContador]: { increment: 1 },
      },
    });

    const edicionesRestantes = 2 - user[campoContador];
    let infoExtra = "";
    if (edicionesRestantes === 1) {
      infoExtra =
        "Último intento: esta es tu última oportunidad para editar este campo.";
    } else if (edicionesRestantes === 0) {
      infoExtra =
        "Has alcanzado el límite de 3 ediciones para este campo. Para más cambios, contacta al soporte.";
    }

    res.json({
      message: `$${
        campo === "nombreCompleto"
          ? "Nombre"
          : campo === "telefono"
          ? "Teléfono"
          : "Fecha de nacimiento"
      } actualizado correctamente`,
      edicionesRestantes,
      infoExtra,
      user: {
        idUsuario: updatedUser.idUsuario,
        [campo]: updatedUser[campo],
        [campoContador]: updatedUser[campoContador],
      },
    });
  } catch (error) {
    console.error("Error al actualizar campo:", error);
    res.status(500).json({ message: "Error al actualizar el campo." });
  }
};

export const getUserProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  const idUsuario = Number(req.params.idUsuario); // Aseguramos que sea número

  if (isNaN(idUsuario)) {
    res.status(400).json({ message: "ID de usuario inválido" });
    return;
  }

  try {
    const user = await authService.getUserById(idUsuario); // Usamos el servicio

    if (!user) {
      res.status(404).json({ message: "Usuario no encontrado" });
      return;
    }

    res.status(200).json({
      idUsuario: user.idUsuario,
      nombreCompleto: user.nombreCompleto,
      email: user.email,
      telefono: user.telefono,
      fechaNacimiento: user.fechaNacimiento,
    });
  } catch (error) {
    console.error("Error al obtener el perfil:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

export const deleteIncompleteUserController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email } = req.body;

  if (!email) {
    res.status(400).json({ message: "Falta el email" });
  }

  try {
    const user = await prisma.usuario.findUnique({ where: { email } });

    if (!user) {
      res.status(404).json({ message: "Usuario no encontrado" });
      return;
    }

    if (user.verificado) {
      res.status(400).json({
        message: "El usuario ya fue verificado, no se puede eliminar",
      });
    }

    await prisma.usuario.delete({ where: { email } });

    res.status(200).json({ message: "Usuario eliminado con éxito" });
  } catch (error) {
    console.error("Error al eliminar usuario incompleto:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
export const checkPhoneExists = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { telefono } = req.body;

  if (!telefono) {
    res.status(400).json({ message: "Teléfono no proporcionado" });
  }

  try {
    const user = await authService.findUserByPhone(telefono);
    if (user) {
      res.json({ exists: true });
      return;
    }
    res.json({ exists: false });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};
