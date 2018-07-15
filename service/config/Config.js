var express = require('express');
var load = require('express-load');
var bodyParser = require('body-parser');

module.exports = function() {
	var app = express();
	//app.set('view engine', 'ejs');
	//app.set('views', './views');
	app.use(bodyParser.urlencoded({extended: true}));
	//app.use(express.static('./views/public'));
	app.use(bodyParser.json());

	app.use(function(req, res, next) {
	  res.header("Access-Control-Allow-Origin", "*");
	  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	  res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
	  next();
	});

	load('controller').into(app);

	return app;
}

