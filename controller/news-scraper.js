var cheerio = require('cheerio');
var request = require('request');
var express = require('express');
var mongoose = require('mongoose')

var router = express.Router();

var Article = require('../models/Article.js');
var Note = require('../models/Note.js')

mongoose.Promise = Promise;



router.get("/", function(req, res) {
	res.render("index");
});

//get articles already scraped and saved in db 
router.get("/saved", function(req, res) {

	Article.find({}, function(error, doc) {

		if(error){
			console.log(error);
		}

		else{
			var hbsArticleObject = {
				articles: doc
			};

			res.render("saved", hbsArticleObject);
		}
	});
});

router.post("/scrape", function(req, res) {

  // First, we grab the body of the html with request
  request("http://www.nytimes.com/", function(error, response, html) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(html);

    // Make emptry array for temporarily saving and showing scraped Articles.
    var scrapedArticles = {};
    // Now, we grab every h2 within an article tag, and do the following:
    $("article h2").each(function(i, element) {

      // Save an empty result object
      var result = {};

      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this).children("a").text();      
      result.link = $(this).children("a").attr("href");

      scrapedArticles[i] = result;

    });

    console.log("Scraped Articles object: " + scrapedArticles);

    var hbsArticleObject = {
        articles: scrapedArticles
    };

    res.render("index", hbsArticleObject);

  });

});

router.post("/save", function(req,res){

	console.log("This is the title: " + req.body.title);

	var newArticleObject = {};

	newArticleObject.title = req.body.title;

	newArticleObject.link = req.body.link;

	var entry = new Article(newArticleObject);

	console.log("We can save the article: " + entry);

	entry.save(function(err, doc){

		if(err) {
			console.log(err);
		}

		else {
			console.log(doc);
		}
	});

	res.redirect("/saved");

});



router.get("/delete/:id", function(req,res){

	Article.findOneAndRemove({"_id": req.params.id}, function(err, offer){

		if(err){
			console.log("Unable to delete: " + err);
		}

		res.redirect("/saved");
	})
})


router.get("/notes/:id", function(req,res){

	console.log("ID is getting read for delete " + req.params.id);

	console.log("Able to activate delete function.");

	Note.findOneAndRemove({"_id": req.params.id}, function(err, doc){
		if(err){
			console.log("Not able to delete: " + err)
		}

		else {
			console.log("Able to delete.")
		};


		res.send(doc);

	});
});

router.get("/articles/:id", function(req, res){

	console.log("ID is getting read: " + req.params.id);

	Article.findOne({"_id": req.params.id})

	.populate('notes')

	.exec(function(err, doc){

		if(err){
			console.log("Unable to find article and get notes.");
		}

		else{
			console.log("Getting articles and notes" + doc);
			res.json(doc);
		}
	});
});

router.post("/articles/:id", function(req, res){

	var newNote = new Note(req.body);

	newNote.save(function(error, doc){

		if(error){
			console.log(error);
		}

		else{
			Article.findOneAndUpdate({"_id": req.params.id},{$push: {notes: doc._id}}, {new: true, upsert: true})

			.populate('notes')

			.exec(function(err, doc){

				if(err){
					console.log("Cannot find article.");
				} else{
					console.log("Receving notes: " + doc.notes);
					res.send(doc);
				}
			});
		}
	});
});

//Export routes for server.js
module.exports = router;