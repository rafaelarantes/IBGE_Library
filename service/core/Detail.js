var Request = require('./Request');
var Request = require('../config/JsonFileParse');
var Logger = require('../log/Logger');
this.log;

function Detail() {
    var jsonFileParse = new JsonFileParse("IBGE");
    this.urlIBGE = jsonFileParse.getValue("url");
    this.log = Logger.getLogger();
}

function get(urlParams){
    var defGetDetails = Promise.defer();
    let request = new Request();
    request.get(this.urlIBGE+urlParams).then(($) => {
        if($("div[id='detalhes']")) {
            $("div[id='detalhes']").children().children().each(function(i, elem){
                if($(this).text() != ''){
                    values.push($(this).text());
                }
            });

            var json = {};
            
            for(let i=0; i < values.length; i+=2) {
                if(values[i].toUpperCase().trim().replace(":","") == "ID")
                {
                    json["_id"] = values[i+1];
                }
                else{
                    json[formatField(values[i])] = {
                        "originalName" : values[i],
                        "value" : values[i+1]
                    };
                }
            }

            defGetDetails.resolve(json)
        }else{
            defGetDetails.reject("Não há detalhes disponíveis")
        }

    }).catch((err) => {
        if(err)
            this.log.error(err);
        defGetDetails.reject();
    });

    return defGetDetails.promise;
}

function formatField(text)
{       
    text = text.toLowerCase().trim();                                                         
    text = text.replace(new RegExp('[ÁÀÂÃ]','gi'), 'a');
    text = text.replace(new RegExp('[ÉÈÊ]','gi'), 'e');
    text = text.replace(new RegExp('[ÍÌÎ]','gi'), 'i');
    text = text.replace(new RegExp('[ÓÒÔÕ]','gi'), 'o');
    text = text.replace(new RegExp('[ÚÙÛ]','gi'), 'u');
    text = text.replace(new RegExp('[Ç]','gi'), 'c');
    text = text.replace(/[^\w\s]/gi, '')
    text = text.replace(/ /g, '_');
    return text                 
}

module.exports = Detail;