var Database = require('./Database');
var Logger = require('../log/Logger');
this.log; 

function DAO(){
	this.log = Logger.getLogger();
}

DAO.prototype.save = (values) => {
	var defSave = Promise.defer();
	var ids = getIds(values);
	
	Database.createConnection(values, (dbo, collectionName) => {
		var defConnection = Promise.defer();
		findUnsavedIds(dbo, values, ids, collectionName).then((valuesInsert) => {
			if(valuesInsert.length > 0){
				insertValues(dbo, valuesInsert, collectionName).then((affectedRegisters) => {
					defConnection.resolve();
					defSave.resolve(affectedRegisters);
				}).catch((err) => {
					this.log.error(err);
					defConnection.reject();
					defSave.reject();
				});
			} else
				defSave.resolve(valuesInsert.length);

		}).catch((err) => {
			this.log.error(err);
			defConnection.reject();
			defSave.reject();
		});

		return defConnection.promise;
	});
	
	return defSave.promise;
}

function insertValues(dbo, values, collectionName){
	var defInsert = Promise.defer();

	dbo.collection(collectionName).insert(values, (err) =>{
		if(err){
			this.log.error(err);
			defInsert.reject();
		} else {
			defInsert.resolve(values.length);
		}
	});

	return defInsert.promise;
}

function findUnsavedIds(dbo, values, ids, collectionName){
	var defFind = Promise.defer();
	var valuesInsert = [];

	dbo.collection(collectionName).find({_id: {$in: ids} }).toArray((err, docs) => {
		  if(docs) {
              if (err) {
				this.log.error(err);
                defFind.reject();
              } else {
                valuesInsert = values.filter((value) => {
					var idsDoc = getIds(docs);
					if (!idsDoc.includes(value._id)) {
						return value;
				  	}

              	});
              }
          } else
          	valuesInsert = values;

		  defFind.resolve(valuesInsert);
	})

	return defFind.promise;
}

function getIds(values){
	var ids = [];

	for(let v of values){
		ids.push(v._id);
	}

	return ids;
}

module.exports = DAO;