var mongoose = require('mongoose');
//create schema class
var Schema = mongoose.Schema;

//Note schema
var NoteSchema =  new Schema({

	body: {
		type: String
	}
});

//create Note model
var Note = mongoose.model("Note", NoteSchema);

//export Note model
module.exports = Note;
