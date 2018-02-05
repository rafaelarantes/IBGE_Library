var Extract = require('../core/Extract');
var DAO = require('../config/DAO');

module.exports = function(app) {
	app.get('/', (req, res) =>{
		res.render('index',{
			success : false,
			error: false,
			message: "",
			count: 0
		});
	});

	app.get('/library', (req,res) => {
		let extract = new Extract();
		let path = req.url.split("?");

		if (path.length != 2) {
			res.render('index',{
				success : false,
				error: true,
				message: "Erro interno",
				count: 0
			});

		} else {
			console.log("======== Extracting data...\t\t=======");
			
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