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

//GET request to scrape BBC site
router.post("/scrape", function(req, res){

	request("http://www.bbc.com/news/", function(error, response, html){

		var $ = cheerio.load(html);

		var scrapedArticles = {};

		$("article h2").each(function(i, element){
			
			var result = {};

			result.title = $(this).children("a").text();

			console.log("What's the result title?" + result.title)	

			result.title = $(this).children("a").attr("href");

			scrapedArticles[i] = result;

		});

		console.log("Scraped articles object built nicely: " + scrapedArticles);

		var hbsArticleObject = {articles: scrapedArticles};

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

		if(error) {
			console.log(err);
		}

		else {
			console.log(doc);
		}
	});

	res.redirect("/saved");

});


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