var request = require('request');
var Logger = require('../log/Logger');
var log;

function Request(){
    log = Logger.getLogger();
}

function get(url){
	var defRequest = Promise.defer();

	request(url, function(error, response, html){
		if(error){
			log.error(error);
			defRequest.reject();	
		} else {
			var $ = cheerio.load(html);
			defRequest.resolve($);
		}
	});

    return defRequest.promise;
}