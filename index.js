fs = require('fs');
http = require('http');
url = require('url');
path = require("path");


http.createServer(function(req, res){
	var request = url.parse(req.url, true);

	var fullFilePath = path.join(process.cwd(), url.parse(req.url).pathname);

	fs.stat(fullFilePath, function(err) {
		if(err) {
			res.statusCode = 404;
			res.end("File not found");
			return;
		}

		if (fs.statSync(fullFilePath).isDirectory()) {
			var body = '<html>'+
			'<head>'+
			'<meta http-equiv="Content-Type" '+
			'content="text/html; charset=UTF-8" />'+
			'</head>'+
			'<body>'+
			'<ul>'+
			'<li>View <a href="/files/test.txt">test.txt</a></li>' +
			'<li>View <a href="/files/video.mp4">Jake\'s Perfect Sandwich [HD].mp4</a></li>' +
			'</ul>'+
			'</body>'+
			'</html>';
			res.writeHead(200, {"Content-Type": "text/html"});
			res.write(body);
			res.end();
		} else{

			//always only download video file
			// var file = new fs.ReadStream(fullFilePath);
			// file.pipe(res);

			fs.readFile(fullFilePath, function(err, content){
				if(err) {
					res.statusCode=500;
					res.end("Server Error");
					console.error(err);
				}

				var mime = require('mime').lookup(fullFilePath);
				res.setHeader('Content-Type', mime);
				res.end(content);
			})

		}

	});

}).listen(8080);
