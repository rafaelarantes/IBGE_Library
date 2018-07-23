var app = require('./config/Config')();
var port = 3004;
var url = "http://localhost:"+port;

app.listen(port, function(){
	console.log("\t================================");
	console.log("\t========= IBGE Library =========");
	console.log("\t================================\r\n");
	console.log("======== Server running in port " + port + "\t\t\t=======");
	console.log("======== Open in your browser: "+ url +"\t=======");
});
