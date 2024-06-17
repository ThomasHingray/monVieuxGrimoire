const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

// Il ne peut y avoir qu'un compte par adresse

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);