// src/middlewares/auth/multerEditarDriver.ts
import multer from "multer";

const storage = multer.memoryStorage(); // Para subir a Cloudinary

const uploadEditarDriver = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Máx. 5MB por archivo
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/png"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Formato inválido. Solo se permiten imágenes PNG."));
    }
  },
});

export default uploadEditarDriver;
