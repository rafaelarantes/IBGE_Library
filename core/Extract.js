var request = require('request');
var rp = require('request-promise');
var cheerio = require('cheerio');
var requestSync = require('requestsync');

urlLibrary = "https://biblioteca.ibge.gov.br/index.php/biblioteca-catalogo?";

function Extract(){

}

Extract.prototype.get = (params) => {
	var defGet = Promise.defer();

	requestUrl(params).then(($) => {

		filterData($).then((urls) => {
			if(urls.length > 0){
				let values = getDetailData(urls);
				defGet.resolve(values);
			}else
				defGet.reject("Invalid URL");

		}).catch((err) => {
			defGet.reject(err);
		});
		
	}).catch((err) => {
		defGet.reject(err);
	});
	
	return defGet.promise;
}

function requestUrl(params){
	var defRequest = Promise.defer();

	request(urlLibrary + params, function(error, response, html){
		if(error){
			defRequest.reject();	
		} else {
			var $ = cheerio.load(html);
			defRequest.resolve($);
		}
	});

    return defRequest.promise;
}

function filterData($){
	var defFilterData = Promise.defer();
	var urls = [];
	if($('tbody').length == 0){
		defFilterData.reject('[MSG-USER]Nenhuma informação encontrada');
	} else {
		$('tbody').filter(function() {
			$(this).children().each(function(i, elem) {
				let urlLink = $(this).children().children().attr('href');

				urlLink = urlLink.split("?");
				
				if(urlLink.length > 0){
					urls.push(urlLink[1]);
				}
			});

			console.log("======== Extracted: "+urls.length+"\t\t\t=======");
			defFilterData.resolve(urls);
		});
	}

	return defFilterData.promise;
}

function getDetailData(urls){
	console.log("======== Getting data details...\t=======");
	valuesJson = [];
	for(let urlIndex = 0; urlIndex < urls.length; urlIndex++){
			var url = urls[urlIndex];
			console.log("=======> " + (urlIndex+1) + " of " + urls.length);
			var res = requestSync({method: 'GET', url: urlLibrary+url, timeout: 10000, retry: true});
			var $ = cheerio.load(res.body);
			var values = [];

			if($("div[id='detalhes']")) {
				$("div[id='detalhes']").children().children().each(function(i, elem){
					if($(this).text() != ''){
						values.push($(this).text());
					}
				});

				var json = {};

				for(let i=0; i < values.length; i+=2) {
					if(values[i].toUpperCase().trim().replace(":","") == "ID")
					{
						json["_id"] = values[i+1];
					}
					else
						json[formatField(values[i])] = values[i+1];
				}

				valuesJson.push(json);
			}

	}

	return valuesJson;
}

function formatField(text)
{       
    text = text.toLowerCase().trim();                                                         
    text = text.replace(new RegExp('[ÁÀÂÃ]','gi'), 'a');
    text = text.replace(new RegExp('[ÉÈÊ]','gi'), 'e');
    text = text.replace(new RegExp('[ÍÌÎ]','gi'), 'i');
    text = text.replace(new RegExp('[ÓÒÔÕ]','gi'), 'o');
    text = text.replace(new RegExp('[ÚÙÛ]','gi'), 'u');
    text = text.replace(new RegExp('[Ç]','gi'), 'c');
    text = text.replace(/[^\w\s]/gi, '')
    text = text.replace(/ /g, '_');
    return text                 
}

module.exports = Extract;




