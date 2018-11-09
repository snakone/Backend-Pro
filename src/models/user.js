const mongoose = require('mongoose');  // MongoDb
const { Schema } = mongoose;  // Only need Schema

const validator = require ('mongoose-unique-validator');  // Validate Unique Fields
const roles = {
  values: ['ADMIN_ROLE', 'USER_ROLE'],
  message: '{VALUE} is not an available rol'
}

const userSchema = new Schema ({
  name: { type: String, required: [true, 'Name required']},
  lastName: { type: String, required: [true, 'LastName required']},
  email: { type: String, unique: true, required: [true, 'Email required']},
  password: { type: String, required: [true, 'Password required']},
  image: { type: String, required: false},
  role: { type: String, required: true, default: 'USER_ROLE', enum: roles},
  google: { type: Boolean, default: false }
});

userSchema.plugin(validator, { message: '{PATH} must be unique'})   // Validate

module.exports = mongoose.model('User', userSchema);
// MongoDB will create a Collection 'User' -> 'users'
