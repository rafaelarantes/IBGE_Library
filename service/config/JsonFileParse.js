var fs = require('fs');
this.text;
this.file;
var scope = this;

function JsonFileParse(){}

JsonFileParse.prototype.openFile = (jsonFile) => {
    scope.file = jsonFile;

    if(scope.file){
        return new Promise((resolve, reject) => {
            fs.readFile(`config/json/${scope.file}.json`, 'utf8', (err, data) => {
                if (err) reject(err);
                scope.data = JSON.parse(data);
                resolve();
            });
        }); 
    }
}

JsonFileParse.prototype.getValue = (attributeName) => {
    return scope.data[attributeName];
}

JsonFileParse.prototype.getValues = () => {
    return scope.data;
}

module.exports = JsonFileParse;