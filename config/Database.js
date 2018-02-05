var MongoClient = require('mongodb').MongoClient;
var fs = require('fs');

var Database = {
	createConnection: (values, callback) => {
			var obj;
			fs.readFile('./config/config.json', 'utf8', function (err, data) {
			  if (err) throw err;
			  obj = JSON.parse(data);
			  var url = obj["mongoURL"];
			  var databaseName = obj["databaseName"];
			  var collectionName = obj["collectionName"];

			  MongoClient.connect(url, (err, db) => {
					if (err) throw err;

					dbo = db.db(databaseName)
					
					callback(dbo, collectionName).then(() => {
						db.close();
					});
			  });
			});



	}
}

module.exports = Database;
