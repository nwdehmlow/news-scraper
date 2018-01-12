var mongoose = require('mongoose');
//create schema class
var Schema = mongoose.schema;

//Note schema
var NoteSchema =  mongoose.Schema({

	body: {
		type: String
	}
});

//create Note model
var Note = mongoose.model("Note", NoteSchema);

//export Note model
module.exports = Note;
