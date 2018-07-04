var Extract = require('../core/Extract');
var DAO = require('../database/DAO');
var ResponseStatus = require('./helper/ResponseStatus');
var JsonFileParse = require('../config/JsonFileParse');

module.exports = function(app) {
	var responseStatus = new ResponseStatus();
	var jsonFileParse = new JsonFileParse("FieldsDictionary.json");

	app.get('/', (req, res) => {
		let responseStatus = new ResponseStatus();
		res.render('index', responseStatus.getStatus());
	});

	app.get('/library', (req,res) => {
		let extract = new Extract();
		let path = req.url.split("?");
		let responseStatus = new ResponseStatus();
		
		if (path.length != 2) {
			res.render('index', responseStatus.setStatusError(0, "Erro interno").getStatus());

		} else {
			console.log("======== Extracting data...\t\t=======");
			res.render('index', responseStatus.setStatusPending(0, "Extracting data").getStatus());
			
			var params = path[1];

			extract.get(params).then((values) => {
				var dao = new DAO();

				console.log("======== Saving data...\t\t\t=======");

				dao.save(values).then((countRegisters) => {
					console.log("======== Recorded: "+countRegisters+"\t\t\t=======");
					console.log("======== Finished!\t\t\t=======");

					res.render('index',{
						success : true,
						error: false,
						message: "Foram inseridos " + countRegisters + " registros com sucesso!",
						count: countRegisters
					});

				}).catch((err) => {
					let success = false;
					let error = true;

					if(err) {
						if(err.toString().indexOf('[MSG-USER]') !== -1)
						{
							success = true;
							error = false;
							err = err.replace("[MSG-USER]", "");
						}
						else
							console.log("======== " + err + "\t\t\t=======");
					}

					res.render('index',{
						success : success,
						error: error,
						message: err,
						count: 0
					});
				});

			}).catch((err) => {
					let success = false;
					let error = true;

					if(err) {
						if(err.toString().indexOf('[MSG-USER]') != -1)
						{
							success = true;
							error = false;
							err = err.replace("[MSG-USER]", "");
						}
						else
							console.log("======== " + err + "\t\t\t=======");
					}

					res.render('index',{
						success : success,
						error: error,
						message: err,
						count: 0
						 
					});
			});
		}
	});
}