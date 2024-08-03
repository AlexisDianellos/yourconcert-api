const multer = require('multer');
const uploadMiddleware = multer({ dest: './uploads' });

const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({ error: 'File is too large' });
    }
  }
  next(err);
};

module.exports = { uploadMiddleware, handleMulterError };
