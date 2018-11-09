const mongoose = require('mongoose');  // MongoDb
const { Schema } = mongoose;  // Only need Schema

const validator = require ('mongoose-unique-validator');  // Validate Unique Fields

var doctorSchema = new Schema({
		name: { type: String, required: [true, 'Doctor\'s name required'] },
		image: { type: String, required: false },
		user: { type: Schema.Types.ObjectId, ref: 'User', required: true },  // ID Mongo Ref
		hospital: { type: Schema.Types.ObjectId, ref: 'Hospital',  // ID Mongo Ref
							 required: [true, 'Hospital\'s ID required'] }
});

doctorSchema.plugin(validator, { message:'{PATH} must be unique'})  // Validator

module.exports = mongoose.model('Doctor', doctorSchema);
// MongoDB will create a Collection 'doctor' -> 'doctors'
