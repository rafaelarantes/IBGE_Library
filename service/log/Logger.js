var log4js = require('log4js');

var Logger = {
	getLogger: () => {
        Configure();
        return log4js.getLogger("error");
	}
}

function Configure(){
    log4js.configure({
        appenders: {
        out:{ type: 'console' },
        app:{ type: 'file', filename: './log/files/error.log' }
        },
        categories: {
        default: { appenders: [ 'out', 'app' ], level: 'debug' }
        }
    });
}

module.exports = Logger;