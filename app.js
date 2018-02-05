var app = require('./config/Express')();
var opn = require('opn');
var port = 3004;

app.listen(port, function(){
	console.log("\t================================");
	console.log("\t========= IBGE Library =========");
	console.log("\t================================\r\n");
	console.log("======== Server running in port " + port + "\t=======");
	console.log("======== Your default browser will open\t=======");
	opn('http://localhost:'+port);
});
