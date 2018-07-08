var fs = require('fs');
this.data;
this.file;

function JsonFileParse(jsonFile){
    this.file = jsonFile;
    if(this.file){
        fs.readFile(`config/json/${this.file}.json`, 'utf8', function (err, data) {
            if (err) throw err;
            this.data = JSON.parse(data);
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