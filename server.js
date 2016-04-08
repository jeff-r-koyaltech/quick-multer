var os = require('os');
var express=require("express");
var multer  = require("multer");
var serveIndex = require('serve-index');
var serveStatic = require('serve-static');
var path = require("path");
var app=express();

var done = false;

app.use(multer({ dest: './uploads/',
	rename: function (fieldname, filename) {
		return filename + Date.now();
	},
	onFileUploadStart: function (file) {
		console.log(file.originalname + ' is starting ...');
		done = false;
	},
	onFileUploadComplete: function (file) {
		console.log(file.fieldname + ' uploaded to  ' + file.path)
		done=true;
	}
}));

app.get('/',function(req,res){
	res.sendFile(path.join(__dirname, "index.html"));
});

app.post('/api/upload',function(req,res){
	if(done==true){
		console.log(req.files);
		res.end("File uploaded.");
	}
});

var uploadsPath = path.join(__dirname, "uploads");

//Send index.html responses for folders
app.use('/uploads', serveIndex(uploadsPath, {'icons': true}))

//Send static files when requested
app.use('/uploads', serveStatic(uploadsPath))

/*Run the server.*/
var port = 80;
app.listen(port,function(){

	console.log("\n\nWorking on port " + port);

	var ifaces = os.networkInterfaces();

	Object.keys(ifaces).forEach(function (ifname) {
		var alias = 0;

		ifaces[ifname].forEach(function (iface) {
			if ('IPv4' !== iface.family || iface.internal !== false) {
				// skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
				return;
			}

			if (alias >= 1) {
				// this single interface has multiple ipv4 addresses
				console.log(ifname + ':' + alias, iface.address);
			} else {
				// this interface has only one ipv4 adress
				console.log(ifname, iface.address);
			}
			++alias;
	  });
	});
});