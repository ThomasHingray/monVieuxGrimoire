const multer = require('multer');

  // Définition des types MIME pour gérer les différents types de fichiers reçus
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
  'image/png': 'png'
};

  // Définition du storage avec multer avec un dossier de destination (images) et un nouveau nom de fichier pour éviter les doublons
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);
  }
});


module.exports = multer({storage: storage}).single('image');