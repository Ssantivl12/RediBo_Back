import { Router } from 'express';
import { enviarCorreoPrueba } from '../controllers/emailController';

const router = Router();

router.post('/enviar-correo', enviarCorreoPrueba);

export default router;
