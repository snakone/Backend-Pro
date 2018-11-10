const mongoose = require('mongoose');  // MongoDb
const { Schema } = mongoose;  // Only need Schema

const validator = require ('mongoose-unique-validator');  // Validate Unique Fields

const hospitalSchema =	new Schema({
		name: {	type: String,	required: [true,'Hospital name required']	},
		address: { type: String, required: [true,'Address name required'] },
		image: { type: String, required: false },
		user: {	type: Schema.Types.ObjectId,	ref: 'User'}  // Reference using MongoID
},	{	collection: 'hospitals' });  // Name the Collection

hospitalSchema.plugin(validator, { message:'{PATH} must be unique'})  // Validate

module.exports = mongoose.model('Hospital', hospitalSchema);
// MongoDB will create a Collection 'hospital' -> 'hospitals'
