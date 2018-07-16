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
	let request = new Request();
	return new Promise((resolve, reject) => { 
			request.get(this.urlIBGE+params).then(($) => {
			filterData($).then((urls) => {
				resolve(urls);
			}).catch((err) => {
				if(typeof(err) != typeof(new Error))
				{
					this.log.error(err);
					reject();
				}
				else
				{
					reject(err);
				}
			});
			
		}).catch((err) => {
			if(typeof(err) != typeof(new Error))
			{
				this.log.error(err);
				reject();
			}
			else
				reject(err);
		});
	});
}

function filterData($){
	var urls = [];
	return new Promise((resolve,reject) => {
		if($('tbody').length == 0){
			reject('Nenhuma informação encontrada');
		} else {
			$('tbody').filter(function() {
				$(this).children().each(function(i, elem) {
					let urlLink = $(this).children().children().attr('href');
					urlLink = urlLink.split("?");
					
					if(urlLink.length > 0){
						urls.push(urlLink[1]);
					}
				});

				resolve(urls);
			});
		}
	});
}

module.exports = Extract;




