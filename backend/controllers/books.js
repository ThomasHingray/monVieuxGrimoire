const Book = require('../models/book')
const fs = require('fs')


// Créer un livre

exports.createBook = (req, res, next) => {

  // Récupérer dans la requête les informations du livre à créer
  const bookObject = JSON.parse(req.body.book)

  // Supprimer les id générés par mongoDB
  delete bookObject._id
  delete bookObject._userId

  // Créer le nouvel objet avec un userId correspondant aux informations de connection
  const book = new Book({
      ...bookObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}.webp`
  })

  // Sauvegarder le nouveau livre, répondre au frontend et attraper les erreurs
  book.save()
  .then(() => { res.status(201).json({message: 'Objet enregistré !'})})
  .catch(error => { res.status(400).json( { error })})
}


  // Ouvrir la page d'un livre
exports.getOneBook = (req, res, next) => {

  // Trouver le livre avec son Id et l'envoyer en réponse
  Book.findOne({
    _id: req.params.id
  }).then(
    (book) => {
      res.status(200).json(book)
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      })
    }
  )
}


  // Voir tous les livres
exports.getAllBooks = (req, res, next) => {
  Book.find()
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({ error }))
}

  // Voir les 3 meilleurs livres
exports.getBestBooks = (req, res, next) => {

    // Trier les livres dans l'ordre décroissant, sélectionner les 3 premiers et les renvoyer
  Book.find()
    .sort({ averageRating: -1 })
    .limit(3) 
    .then((bestBooks) => {
      res.status(200).json(bestBooks)
    })
    .catch((error) => {
      res.status(500).json({
        error: error.message
      })
    })
}

  // Modifier un livre
exports.modifyBook = (req, res, next) => {

  // Si la requête contient un fichier, modifier le chemin choisi pour l'afficher
  const bookObject = req.file ? {
      ...JSON.parse(req.body.book),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}.webp`
  } : { ...req.body }


  delete bookObject._userId
  Book.findOne({_id: req.params.id})
      .then((book) => {
          if (book.userId != req.auth.userId) {
              res.status(401).json({ message : 'Not authorized'})
          } else {

            // Récupérer le nom du fichier à supprimer et remplacer les informations du livre. 
            // Si l'image est modifiée, on supprime l'ancienne

            if (req.file) {
            const filename = book.imageUrl.split('/images/')[1]
              fs.unlink(`images/${filename}`, () => {
                Book.updateOne({ _id: req.params.id}, { ...bookObject, _id: req.params.id})
                .then(() => res.status(200).json({message : 'Objet modifié!'}))
                .catch(error => res.status(401).json({ error }))
            })} else {
              Book.updateOne({ _id: req.params.id}, { ...bookObject, _id: req.params.id})
                .then(() => res.status(200).json({message : 'Objet modifié!'}))
                .catch(error => res.status(401).json({ error }))
            }
          }
      })
      .catch((error) => {
          res.status(400).json({ error })
      })
}

// Supprimer un livre

exports.deleteBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id})
      .then(book => {
          if (book.userId != req.auth.userId) {
              res.status(401).json({message: 'Not authorized'})
          } else {
              const filename = book.imageUrl.split('/images/')[1]
              fs.unlink(`images/${filename}`, () => {
                  Book.deleteOne({_id: req.params.id})
                      .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                      .catch(error => res.status(401).json({ error }))
              })
          }
      })
      .catch( error => {
          res.status(500).json({ error })
      })
}


  // Noter un livre
exports.rateBook = (req, res, next) => {
  const rating = req.body.rating
  const userId = req.auth.userId ? req.auth.userId : null

  Book.findOne({ _id: req.params.id })
    .then((book) => {

      // Ajouter la nouvelle note
      book.ratings.push({userId, grade:rating})

      const totalRatings = book.ratings.length

      // Accumuler les notes
      const sumRatings = book.ratings.reduce((acc, rating) => acc + rating.grade, 0)

      // En faire la moyenne
      book.averageRating = Math.round(sumRatings / totalRatings)

      return book.save()
    })
    .then((updatedBook) => {
      res.status(201).json(updatedBook)
    })
    .catch((error) => {
      res.status(500).json({ error })
    })
}



