const dotenv = require('dotenv');
const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const userRoutes = require('./routes/user')
const booksRoutes = require('./routes/books')

dotenv.config({
  path: process.env.NODE_ENV === 'production' ? '.env.prod' : '.env.dev'
})

// Connection à mongo
console.log(process.env)
mongoose.connect('mongodb+srv://MVGUser:' + process.env.PASSWORD + '@monvieuxgrimoire.ijiiay5.mongodb.net/?retryWrites=true&w=majority&appName=MonVieuxGrimoire')
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'))

// utilisation de express

const app = express()

app.use(express.json())

// Ajout des header pour le CORS

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
    next()
  })


// Initialisation des router

app.use('/api/books', booksRoutes)
app.use('/api/auth', userRoutes)
app.use('/images', express.static(path.join(__dirname, 'images')))

module.exports = app