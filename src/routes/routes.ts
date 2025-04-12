// Este es solo un archivo para marcar la estructura del proyecto, por lo que debe ser eliminado 


/*
Vista rápida del funcionamiento y contenido de esta carpeta

Define las rutas (URL's) de la API

    - Mapeo de URL a controladores
    - Aplicación de middlewares específicos a rutas
*/

//imports globales
import { Request, Response } from 'express';

//imports locales
import { marcarOcupado } from '../controllers/autoController';

const express = require('express');
const router = express.Router();

router.put('/autos/:id/ocupar', marcarOcupado);

router.get('/test', (req: Request, res: Response) => {
  res.send('Router funcionando correctamente!');
});
// router.get('/', index);

export default router;