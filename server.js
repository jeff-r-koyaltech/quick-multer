var express=require("express");
var multer  = require("multer");
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

/*Run the server.*/
var port = 3000;
app.listen(port,function(){
	console.log("Working on port " + port);
});