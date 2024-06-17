const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth')
const multer = require('../middleware/multer-config');
const resize = require('../middleware/resize')

const booksCtrl = require('../controllers/books');

// Définition de chaque route par action

router.get('/', booksCtrl.getAllBooks);

router.post('/', auth, multer, resize, booksCtrl.createBook);

router.get('/bestrating', booksCtrl.getBestBooks);

router.get('/:id', booksCtrl.getOneBook);

router.put('/:id', auth, multer, resize, booksCtrl.modifyBook);

router.delete('/:id', auth, booksCtrl.deleteBook);

router.post('/:id/rating', auth, booksCtrl.rateBook);

module.exports = router;