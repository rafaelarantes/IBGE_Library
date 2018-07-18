var fs = require('fs');
var text, file;

function JsonFileParse(){}

JsonFileParse.prototype.openFile = (jsonFile) => {
    file = jsonFile;

    if(file){
        return new Promise((resolve, reject) => {
            fs.readFile(`config/json/${file}.json`, 'utf8', (err, data) => {
                if (err) reject(err);
                data = JSON.parse(data);
                resolve();
            });
        }); 
    }
}

JsonFileParse.prototype.getValue = (attributeName) => {
    return data[attributeName];
}

JsonFileParse.prototype.getValues = () => {
    return data;
}

module.exports = JsonFileParse;