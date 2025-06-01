//
import multer from "multer";

// Usa almacenamiento en memoria para permitir subir a Cloudinary
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { 
    fileSize: 5 * 1024 * 1024, // Máximo 5MB por archivo
    files: 2 // Máximo 2 archivos (anverso y reverso)
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    const allowedFields = ["anverso", "reverso"];
    
    // Verificar tipo de archivo
    if (!allowedTypes.includes(file.mimetype)) {
      cb(new Error("Formato inválido. Solo se permiten JPG, JPEG o PNG."));
      return;
    }
    
    // Verificar nombre del campo
    if (!allowedFields.includes(file.fieldname)) {
      cb(new Error("Campo de archivo no válido. Solo se permiten 'anverso' y 'reverso'."));
      return;
    }
    
    cb(null, true);
  },
});

export default upload;