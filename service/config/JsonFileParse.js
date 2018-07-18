var fs = require('fs');
var text, file, value;

function JsonFileParse(){}

JsonFileParse.prototype.openFile = (jsonFile) => {
    file = jsonFile;

    if(file){
        return new Promise((resolve, reject) => {
            fs.readFile(`config/json/${file}.json`, 'utf8', (err, data) => {
                if (err) reject(err);
                value = JSON.parse(data);
                resolve();
            });
        }); 
    }
}

JsonFileParse.prototype.getValue = (attributeName) => {
    return value[attributeName];
}

JsonFileParse.prototype.getValues = () => {
    return value;
}

module.exports = JsonFileParse;