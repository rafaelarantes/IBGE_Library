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
				insertValues(dbo, valuesInsert, collectionName).then((affectedRegisters) => {
					resolve(affectedRegisters);
				}).catch((err) => {
					log.error(err);
					reject();
				});
			} else
				resolve(valuesInsert.length);

		}).catch((err) => {
			log.error(err);
			reject();
		});
	});
	
}

DAO.prototype.getUnsavedIds = (values) => {
	var ids = getIds(values);
	return new Promise((resolve, reject) => {
		Database.createConnection(values, (dbo, collectionName) => {
			findUnsavedIds(dbo, values, ids, collectionName).then((valuesUnsaved) => {
				resolve(valuesUnsaved);
			}).catch((err) => {
				log.error(err);
				reject();
			});
		});
	});
}

function insertValues(dbo, values, collectionName){
	return new Promise((resolve, reject) => {
		dbo.collection(collectionName).insert(values, (err) =>{
			if(err){
				this.log.error(err);
				reject();
			} else {
				resolve(values.length);
			}
		});
	});
}

function findUnsavedIds(dbo, values, ids, collectionName){
	var defFind = Promise.defer();
	var valuesInsert = [];

	return new Promise((resolve, reject) => {
		dbo.collection(collectionName).find({_id: {$in: ids} }).toArray((err, docs) => {
			if(docs) {
				if (err) {
					this.log.error(err);
					reject();
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

			resolve(valuesInsert);
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