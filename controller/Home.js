var Extract = require('../core/Extract');
var DAO = require('../database/DAO');
var ControllerStatus = require('./ControllerStatus');
var JsonFileParse = require('../config/JsonFileParse');

module.exports = function(app) {
	var controllerStatus = new ControllerStatus();
	var jsonFileParse = new JsonFileParse("FieldsDictionary.json");

	app.get('/', (req, res) => {
		res.render('index', controllerStatus.getStatusDefault());
	});

	app.get('/library', (req,res) => {
		let extract = new Extract();
		let path = req.url.split("?");

		if (path.length != 2) {
			res.render('index', controllerStatus.getStatusError(0, "Erro interno"));

		} else {
			console.log("======== Extracting data...\t\t=======");
			res.render('index', controllerStatus.getStatusSuccess(0, "Ok"));
			
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