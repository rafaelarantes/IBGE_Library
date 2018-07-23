var Database = require('./Database');
var Logger = require('../log/Logger');
var log; 

function DAO(){
	log = Logger.getLogger();
}

DAO.prototype.save = (values) => {
	return new Promise((resolve, reject) => {
		DAO.prototype.getUnsavedIds(values).then((valuesUnsaved) => {
			if(valuesUnsaved.length > 0){
				insertValues(valuesUnsaved).then((affectedRegisters) => {
					resolve(affectedRegisters);
				}).catch((err) => {
					log.error(err);
					reject();
				});
			} else
				reject("O valor já havido sido inserido");

		}).catch((err) => {
			log.error(err);
			reject();
		});
	});
	
}

DAO.prototype.getUnsavedIds = (values) => {
	if(!values.length)
		values = [values];
	
	var ids = getIds(values);
	return new Promise((resolveGet, rejectGet) => {
		Database.createConnection((dbo, collectionName) => {
			return new Promise((resolveFind, rejectFind) => {
				findUnsavedIds(dbo, values, ids, collectionName).then((valuesUnsaved) => {
					resolveGet(valuesUnsaved);
					resolveFind(valuesUnsaved)
				}).catch((err) => {
					log.error(err);
					rejectGet();
					rejectFind();
				});
			});

		});
	});
}



function insertValues(values){
	return new Promise((resolveInsert, rejectInsert) => {
		Database.createConnection((dbo, collectionName) => {
			return new Promise((resolveConnection, rejectConnection) => {
				dbo.collection(collectionName).insert(values, (err) =>{
					if(err){
						this.log.error(err);
						console.log(err);
						rejectConnection()
						rejectInsert();
					} else {
						resolveConnection(values);
						resolveInsert(values.length);
					}
				});

			});

		});			
	});
}

function findUnsavedIds(dbo, values, ids, collectionName){
	var unsavedValues = [];
	return new Promise((resolve, reject) => {
		dbo.collection(collectionName).find({_id: {$in: ids} }).toArray((err, docs) => {
			if(docs) {
				if (err) {
					this.log.error(err);
					reject();
				} else {
					unsavedValues = values.filter((value) => {
						var idsDoc = getIds(docs);
						if (!idsDoc.includes(value._id)) {
							return value;
						}

					});
				}
			} else
				unsavedValues = values;

			resolve(unsavedValues);
		});
	});
}

function getIds(values){
	var ids = [];
	for(let v of values){
			ids.push(v._id);
	}

	return ids;
}

module.exports = DAO;