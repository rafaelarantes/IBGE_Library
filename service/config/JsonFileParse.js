var fs = require('fs');
this.data;
this.file;

function JsonFileParse(jsonFile){}

JsonFileParse.prototype.openFile = (jsonFile) => {
    this.file = jsonFile;
    var defFile = Promise.defer();
    if(this.file){
        fs.readFile(`config/json/${this.file}.json`, 'utf8', function (err, data) {
            if (err) defFile.reject(err);
            this.data = JSON.parse(data);
            defFile.resolve();
        });
    }
    return defFile.promise;
}

JsonFileParse.prototype.getValue = (attributeName) => {
    return this.data[attributeName];
}

JsonFileParse.prototype.getValues = () => {
    console.log(this.data);
}



module.exports = JsonFileParse;