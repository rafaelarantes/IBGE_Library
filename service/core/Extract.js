var Request = require('./Request');
var cheerio = require('cheerio');
var requestSync = require('requestsync');
var Logger = require('../log/Logger');
var JsonFileParse = require('../config/JsonFileParse');
var log, urlIBGE;

function Extract(){
	log = Logger.getLogger();
	
}

Extract.prototype.get = (params) => {
	let request = new Request();
	return new Promise((resolve, reject) => { 
			getURL().then(() => {
				request.get(urlIBGE+params).then(($) => {
					filterData($).then((urls) => {
						resolve(urls);
					}).catch((err) => {
						if(typeof(err) != typeof(new Error))
						{
							log.error(err);
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
						log.error(err);
						reject();
					}
					else
						reject(err);
				});
			}).catch((err) => {
				log.error(err);
				reject();
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

function getURL(){
    var jsonFileParse = new JsonFileParse();
    return new Promise((resolve, reject) => {
            jsonFileParse.openFile("IBGE").then(() => {
            urlIBGE = jsonFileParse.getValue("url");
            resolve();
        }).catch((err) => {
            reject(err);
        });
    })
}

module.exports = Extract;




