var Extract = require('../core/Extract');
var DAO = require('../database/DAO');
var ResponseStatus = require('./helper/ResponseStatus');
var JsonFileParse = require('../config/JsonFileParse');
var Logger = require('../log/Logger');
var Detail = require('../core/Detail');
this.log;

module.exports = function(app) {
	var responseStatus = new ResponseStatus();
	var jsonFileParse = new JsonFileParse("FieldsDictionary");
	this.log = Logger.getLogger();

	app.get('/', (req, res) => {
		let responseStatus = new ResponseStatus();
		res.render('index', responseStatus.getStatus());
	});

	app.get('/extract', (req,res) => {
		let extract = new Extract();
		let path = req.url.split("?");
		let responseStatus = new ResponseStatus();
		
		if (path.length != 2) {
			this.log.error("Invalid URL");
			res.render('index', responseStatus.setStatusError(0, "Erro interno").getStatus());
		} else {
			res.render('index', responseStatus.setStatusInformation(0, "Extraindo dados").getStatus());
			var params = path[1];

			extract.get(params).then((values) => {
				res.render('index', responseStatus.setStatusSuccess(values.length, "Extração realizada com sucesso", values).getStatus());
			}).catch((err) => {
				let response = responseStatus.setStatusError(0, "Erro interno").getStatus()

				if(err) {
					if(typeof(err) == typeof(new Error))
					this.log.error(err);
					else
						response = responseStatus.setStatusInformation(0, err).getStatus()
				}

				res.render('index', response);
			});
		}
	});

	app.get('/details', (req,res) => {
		let urlParams = req.url.split("?");;
		let detail = Detail();
		detail.get(urlParams).then((json) => {
			res.render('index', responseStatus.setStatusSuccess(1, "", json).getStatus());
		}).catch((err) => {
			let response = responseStatus.setStatusError(0, "Erro interno").getStatus()
			
			if(err) {
				if(typeof(err) == typeof(new Error))
				this.log.error(err);
				else
					response = responseStatus.setStatusInformation(0, err).getStatus()
			}

			res.render('index', response);
		});
	});

	app.post('/save', (req,res) => {
		let values = req.body;
		let dao = new DAO();

		dao.save(values).then((recordsAffected) => {
			res.render('index', responseStatus.setStatusSuccess(recordsAffected, "Finalizado").getStatus());

		}).catch((err) => {
			let response = responseStatus.setStatusError(0, "Erro interno").getStatus()
			
			if(err) {
				if(typeof(err) == typeof(new Error))
				this.log.error(err);
				else
					response = responseStatus.setStatusInformation(0, err).getStatus()
			}

			res.render('index', response);
		});
	});
}