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

	app.get('/api/SearchChoiceField/get', (req, res) => {
		let responseStatus = new ResponseStatus();
		let jsonFileParse = new JsonFileParse();
		jsonFileParse.openFile("FieldsDictionary").then(() => {
			responseStatus.setStatusSuccess(jsonFileParse.getValues());
			res.json(responseStatus.getStatus());
		});
	});

	app.get('/api/SearchExtract/get', (req,res) => {
		var responseStatus = new ResponseStatus();
		let searchExtractParams = {
			material: req.query.material,
			field: req.query.field,
			text: req.query.text
		 };

		 let extract = new Extract();

		extract.get(searchExtractParams).then((values) => {
			responseStatus.setStatusSuccess(values, values.length)
			res.json(responseStatus.getStatus());
		}).catch((err) => {
			responseStatus.setStatusError(0, "Erro interno");

			if(err) {
				if(typeof(err) == typeof(new Error))
					log.error(err);
				else
					responseStatus.setStatusInformation(0, err);
			}

			res.json(responseStatus.getStatus());
		});
	});

	app.get('/api/SearchDetail/:id', (req,res) => {
		let id = req.params.id;
		let detail = Detail();

		detail.get(id).then((json) => {
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
					log.error(err);
				else
					response = responseStatus.setStatusInformation(0, err).getStatus()
			}

			res.render('index', response);
		});
	});
}