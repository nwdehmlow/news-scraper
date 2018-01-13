var mongoose = require('mongoose');
//create schema class
var Schema = mongoose.Schema;

//Comment schema
var CommentSchema =  new Schema({

	body: {
		type: String
	}
});

//create Note model
var Comment = mongoose.model("Comment", Comment);

//export Note model
module.exports = Comment;
