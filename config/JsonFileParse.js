var fs = require('fs');
this.data;

function JsonFileParse(jsonFile){
    fs.readFile('./config/json/'+this.jsonFile, 'utf8', function (err, data) {
        if (err) throw err;
        this.data = JSON.parse(data);
    });
}

JsonFileParse.prototype.getValue = (attributeName) => {
    return data[attributeName];
}

JsonFileParse.prototype.getValues = () => {
    return data;
}



module.exports = JsonFileParse;