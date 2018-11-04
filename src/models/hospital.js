const mongoose = require('mongoose');  // MongoDb
const { Schema } = mongoose;  // Only need Schema

const validator = require ('mongoose-unique-validator');

const hospitalSchema =	new Schema({
		name: {	type: String,	required: [true,'El nombre es necesario']	},
		image: {	type: String,	required: false },
		user: {	type: Schema.Types.ObjectId,	ref: 'User'}
},	{	collection: 'hospitals' });

hospitalSchema.plugin(validator, { message:'{PATH} debe ser único'})

module.exports = mongoose.model('Hospital', hospitalSchema);
// MongoDB will create a Collection 'hospital' -> 'hospitals'
