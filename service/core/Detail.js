var Request = require('./Request');
var Request = require('../config/JsonFileParse');
var Logger = require('../log/Logger');
var log, urlIBGE;

function Detail() {  
    log = Logger.getLogger();
}

Detail.prototype.get = (urlParams) => {
    let request = new Request();
    return new Promise((resolve, reject) => {
        getURL().then(() => {
            request.get(urlIBGE+urlParams).then(($) => {
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

                    resolve(json);
                }else
                    reject("Não há detalhes disponíveis");
                    
            }).catch((err) => {
                if(err)
                    log.error(err);
                    reject();
            });
        }).catch((err) => {
            log.error(err);
            reject()
        });
    });
}

function getURL(){
    var jsonFileParse = new JsonFileParse();
    return new Promise((resolve, reject) => {
            jsonFileParse.openFile("IBGE").then(() => {
            urlIBGE = jsonFileParse.getValue("url");
            resolve();
        }).catch((err) => {
            reject(err);
        });
    })
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