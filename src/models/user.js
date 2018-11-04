const mongoose = require('mongoose');  // MongoDb
const { Schema } = mongoose;  // Only need Schema

const validator = require ('mongoose-unique-validator');
const roles = {
  values: ['ADMIN_ROLE', 'USER_ROLE'],
  message: '{VALUE} no es un rol permitido'
}

const userSchema = new Schema ({
  name: { type: String, required: [true, 'El nombre es necesario']},
  email: { type: String, unique: true, sparse:true, required: [true, 'El correo es necesario']},
  password: { type: String, required: [true, 'El password es necesario']},
  image: { type: String, required: false},
  role: { type: String, required: true, default: 'USER_ROLE', enum: roles},
  google: { type: Boolean, default: false }
});

userSchema.plugin(validator, { message: '{PATH} debe ser único'})

module.exports = mongoose.model('User', userSchema);
// MongoDB will create a Collection 'User' -> 'users'
