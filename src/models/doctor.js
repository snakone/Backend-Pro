const mongoose = require('mongoose');  // MongoDb
const { Schema } = mongoose;  // Only need Schema

const validator = require ('mongoose-unique-validator');

var doctorSchema = new Schema({
		name: { type: String, required: [true, 'El nombre es necesario'] },
		image: { type: String, required: false },
		user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
		hospital: { type: Schema.Types.ObjectId, ref: 'Hospital', required: [true, 'El id hospital es un campo obligatorio'] }
});

doctorSchema.plugin(validator, { message:'{PATH} debe ser único'})

module.exports = mongoose.model('Doctor', doctorSchema);
// MongoDB will create a Collection 'doctor' -> 'doctors'
