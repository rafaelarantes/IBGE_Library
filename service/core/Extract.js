var Request = require('./Request');
var cheerio = require('cheerio');
var requestSync = require('requestsync');
var Logger = require('../log/Logger');
var JsonFileParse = require('../config/JsonFileParse');
this.log;
this.urlIBGE;

function Extract(){
	log = Logger.getLogger();
	var jsonFileParse = new JsonFileParse("IBGE");
	this.urlIBGE = jsonFileParse.getValue("url");
}

Extract.prototype.get = (params) => {
	var defGetExtract = Promise.defer();
	let request = new Request();
	request.get(this.urlIBGE+params).then(($) => {
		filterData($).then((urls) => {
			defGetExtract.resolve(urls);
		}).catch((err) => {
			if(typeof(err) != typeof(new Error))
			{
				this.log.error(err);
				defGetExtract.reject();
			}
			else
			{
				defGetExtract.reject(err);
			}
		});
		
	}).catch((err) => {
		if(typeof(err) != typeof(new Error))
		{
			this.log.error(err);
			defGetExtract.reject();
		}
		else
		{
			defGetExtract.reject(err);
		}
	});
	
	return defGetExtract.promise;
}

function filterData($){
	var defFilterData = Promise.defer();
	var urls = [];
	if($('tbody').length == 0){
		defFilterData.reject('Nenhuma informação encontrada');
	} else {
		$('tbody').filter(function() {
			$(this).children().each(function(i, elem) {
				let urlLink = $(this).children().children().attr('href');
				urlLink = urlLink.split("?");
				
				if(urlLink.length > 0){
					urls.push(urlLink[1]);
				}
			});

			defFilterData.resolve(urls);
		});
	}

	return defFilterData.promise;
}

module.exports = Extract;




