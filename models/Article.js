var mongoose = require("mongoose");

//mongoose schema class
var Schema = mongoose.Schema;

//Article schema
var ArticleSchema = new Schema({

	title: {
		type: String,
		required: true,
	},

	link: {
		type: String,
		required: true
	}
});

var Article = mongoose.model("Article", ArticleSchema);

//Export model
module.exports = Article;