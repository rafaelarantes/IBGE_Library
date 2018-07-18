var request = require('request');
var Logger = require('../log/Logger');
var cheerio = require('cheerio');
var log;

function Request(){
    log = Logger.getLogger();
}

Request.prototype.get = (url) => {
	return new Promise((resolve, reject) => {
		request(url, function(error, response, html){
			if(error){
				log.error(error);
				reject();	
			} else {
				var $ = cheerio.load(html);
				resolve($);
			}
		});
	});
}

module.exports = Request;
