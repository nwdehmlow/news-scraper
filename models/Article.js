var mongoose = require("mongoose");

//mongoose schema class
var Schema = mongoose.Schema;

//Article schema
var ArticleSchema = new Schema({

	title: {
		type: String,
		required: true
	},

	link: {
		type: String,
		required: true
	},

	notes: [{
		type: Schema.Types.ObjectId,
		ref: "Note"
	}]
});

var Article = mongoose.model("Article", ArticleSchema);

//Export model
module.exports = Article;