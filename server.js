var express = require('express');
var bodyParser = require('body-parser');
var handlebars = require('express-handlebars');
var mongoose = require('mongoose');

var Article = require('./models/Article.js');
var Note = require('./models/Note.js');

var request = require('request');
var cheerio = require('cheerio');

mongoose.Promise = Promise;



var PORT = process.env.PORT || 8000;


//intialize express
var app = express();


//set up handlebars
app.engine('handlebars', handlebars({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');


//set up body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: false
}));

app.use(express.static('public'));

//import routes
var routes = require('./controller/news-scraper.js')

app.use('/', routes);

//connect with mongoose

mongoose.connect('mongodb://')

var db = mongoose.connection;

//when logged in through mongoose log a message
db.on('error', function(error){
	console.log("Mongoose Error: ", error)});

db.once('open', function(){
	console.log("Mongoose connection successful.")});




app.listen(PORT, function(){
	console.log('Running on port: ' + PORT)
});