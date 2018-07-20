var Request = require('./Request');
var requestSync = require('requestsync');
var Logger = require('../log/Logger');
var JsonFileParse = require('../config/JsonFileParse');
var log, urlIBGE;

function Extract(){
	log = Logger.getLogger();
	
}

Extract.prototype.get = (searchExtractParams) => {
	params = `acervo=${searchExtractParams.material}&campo=${searchExtractParams.field}&notqry=&opeqry=&texto=${searchExtractParams.text}&digital=false&fraseexata=`
	let request = new Request();
	return new Promise((resolve, reject) => { 
			getURL().then(() => {
				request.get(urlIBGE+params).then(($) => {
					filterData($).then((urls) => {
						resolve(urls);
					}).catch((err) => {
						if(typeof(err) == typeof(new Error))
						{
							log.error(err);
							reject();
						}
						else
							reject(err);
					});
			
				}).catch((err) => {
					if(typeof(err) == typeof(new Error))
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
	var publications = [];

	return new Promise((resolve,reject) => {
		
		if($('tbody').length == 0){
			reject('Nenhuma informação encontrada');
		} else {

			$('tbody').filter(function() {
				$(this).children().each(function(i, elem) {
					var publication = {
						_id: 0,
						url: "",
						title: "",
						author: "",
						year: "",
					};

					let url = getLinkPublication($(this));
					publication.url = url;
					publication.title = $(this).children().eq(0).text();
					publication.author = $(this).children().eq(1).text();
					publication.year = $(this).children().eq(2).text();
					publication._id = url && url.split("id=").length > 0 ? url.split("id=")[1] : "0";
					publications.push(publication);

				});

				resolve(publications);
			});
		}
	});
}

function getLinkPublication(pageObject){
	let linkPublication = pageObject.children().children().attr('href');
	linkPublication = linkPublication.split("?");
	
	if(linkPublication.length > 0){
		return linkPublication[1];
	}
	return "";
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




