import {request, response} from 'express';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Extendemos Request para incluir `user` y `files` con tipado más claro
interface MulterRequest extends Request {
  user?: {
    idUsuario: number;
  };
  files?: {
    [fieldname: string]: Express.Multer.File[];
  };
}