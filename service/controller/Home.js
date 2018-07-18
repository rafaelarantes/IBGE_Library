var Extract = require('../core/Extract');
var DAO = require('../database/DAO');
var ResponseStatus = require('./helper/ResponseStatus');
var JsonFileParse = require('../config/JsonFileParse');
var Logger = require('../log/Logger');
var Detail = require('../core/Detail');
var log;

module.exports = function(app) {
	var responseStatus = new ResponseStatus();
	log = Logger.getLogger();

	app.get('api/', (req, res) => {
		let responseStatus = new ResponseStatus();
		res.json(responseStatus.getStatus());
		//res.render('index', responseStatus.getStatus());
	});

	app.get('/api/SearchChoiceField/get', (req, res) => {
		let responseStatus = new ResponseStatus();
		let jsonFileParse = new JsonFileParse();
		jsonFileParse.openFile("FieldsDictionary").then(() => {
			responseStatus.setStatusSuccess(jsonFileParse.getValues());
			res.json(responseStatus.getStatus());
		});
	});

	app.get('/api/SearchExtract/get', (req,res) => {
		let responseStatus = new ResponseStatus();
		let path = req.url.split("?");
		
		if (path.length != 2) {
			log.error("Invalid URL - Length of path is different of two");
			responseStatus.setStatusError(0, "Erro interno");
		} else {
			let extract = new Extract();
			var params = path[1];

			extract.get(params).then((values) => {
				responseStatus.setStatusSuccess(values, values.length)
			}).catch((err) => {
				responseStatus.setStatusError(0, "Erro interno");

				if(err) {
					if(typeof(err) == typeof(new Error))
						log.error(err);
					else
						responseStatus.setStatusInformation(0, err);
				}
			});
		}
		


		res.json(responseStatus.getStatus());
	});

	app.get('/api/details', (req,res) => {
		let urlParams = req.url.split("?");;
		let detail = Detail();
		detail.get(urlParams).then((json) => {
			res.render('index', responseStatus.setStatusSuccess(1, "", json).getStatus());
		}).catch((err) => {
			let response = responseStatus.setStatusError(0, "Erro interno").getStatus()
			
			if(err) {
				if(typeof(err) == typeof(new Error))
					log.error(err);
				else
					response = responseStatus.setStatusInformation(0, err).getStatus()
			}

			res.render('index', response);
		});
	});

	app.post('/api/save', (req,res) => {
		let values = req.body;
		let dao = new DAO();

		dao.save(values).then((recordsAffected) => {
			res.render('index', responseStatus.setStatusSuccess(recordsAffected, "Finalizado").getStatus());

		}).catch((err) => {
			let response = responseStatus.setStatusError(0, "Erro interno").getStatus()
			
			if(err) {
				if(typeof(err) == typeof(new Error))
					scope.log.error(err);
				else
					response = responseStatus.setStatusInformation(0, err).getStatus()
			}

			res.render('index', response);
		});
	});
}