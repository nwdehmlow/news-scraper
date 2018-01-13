var express = require('express');
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
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
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');


//set up body-parser
app.use(bodyParser.urlencoded({
	extended: false}));

app.use(express.static('public'));

//import routes
var routes = require('./controller/news-scraper.js')
app.use('/', routes);

//connect with mongoose
mongoose.connect('mongodb://heroku_2lx3vfpf:4h2j2j798vrcqc84v6bvq6ea21@ds255347.mlab.com:55347/heroku_2lx3vfpf')
var db = mongoose.connection;

//when logged in through mongoose log a message
db.on('error', function(error){
	console.log("Mongoose error: ", error)});

db.once('open', function(){
	console.log("Mongoose connection successful.")});




app.listen(PORT, function(){
	console.log('Running on port: ' + PORT)
});