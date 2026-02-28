import multer from 'multer';

// Mudamos para MemoryStorage para que funcione em ambientes serverless como a Vercel
const storage = multer.memoryStorage();

export const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // Limite de 5MB
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'image/gif') {
            cb(null, true);
        } else {
            cb(new Error('Somente arquivos GIF são permitidos!'));
        }
    }
});
