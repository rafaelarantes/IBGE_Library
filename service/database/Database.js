var MongoClient = require('mongodb').MongoClient;
var JsonFileParse = require('../config/JsonFileParse');

var Database = {
	createConnection: (values, callback) => {
			var jsonFileParse = new JsonFileParse("Database");
			var url = jsonFileParse.getValue["mongoURL"];
			var databaseName = jsonFileParse.getValue["databaseName"];
			var collectionName = jsonFileParse.getValue["collectionName"];

  			MongoClient.connect(url, (err, db) => {
					if (err) throw err;

					dbo = db.db(databaseName)
					
					callback(dbo, collectionName).then(() => {
						db.close();
					});
			  });
	}
}

module.exports = Database;
