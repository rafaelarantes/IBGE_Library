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
			let dao = new DAO();
			dao.getUnsavedIds(values).then((valuesUnsaved) => {
				responseStatus.setStatusSuccess(valuesUnsaved, valuesUnsaved.length);
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

	app.get('/api/SearchDetail/get/:id', (req,res) => {
		let id = req.params.id;
		let detail = new Detail();
		var responseStatus = new ResponseStatus();
		detail.get(id).then((json) => {
			responseStatus.setStatusSuccess(json, json.length);
			res.json(responseStatus.getStatus());
		}).catch((err) => {
			if(err) {
				if(typeof(err) == typeof(new Error)){
					log.error(err);
					responseStatus.setStatusError(0, "Erro interno");
				}
				else
					responseStatus.setStatusInformation(0, err);
			}
			res.json(responseStatus.getStatus());
		});
	});

	app.post('/api/Publication/post', (req,res) => {
		let values = req.body;
		let dao = new DAO();
		var responseStatus = new ResponseStatus();

		dao.save(values).then((recordsAffected) => {
			responseStatus.setStatusSuccess(null, recordsAffected);
			res.render('index', responseStatus.setStatusSuccess(recordsAffected, "Finalizado").getStatus());

		}).catch((err) => {
			if(err) {
				if(typeof(err) == typeof(new Error)){
					log.error(err);
					responseStatus.setStatusError(0, "Erro interno");
				}
				else
					responseStatus.setStatusInformation(0, err);
			}
			res.json(responseStatus.getStatus());
		});
	});
}