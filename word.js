var http = require('http');
var fs = require('fs');
var path = require('path');
var qs = require('querystring');
var Encoder = require('node-html-encoder').Encoder;

 
http.createServer(function (request, response) {
 
    console.log("request %s", request.url);
    var filePath = '.' + require('url').parse(request.url, true).pathname;
    if (filePath == './')
        filePath = './word.html';

    if (filePath == './word.html') {
        if(request.method=='POST') {
                var body='';
                request.on('data', function (data) {
                   body +=data;
                });
                request.on('end',function(){
                   var POST =  qs.parse(body);
                   console.log(POST);
                   response.writeHead(200, 'Content-Type: text/html');
                   response.end(POST['elm1'], 'utf-8');
                });
        } else if(request.method=='GET') {
                var encoder = new Encoder('entity');
                var htmlSourcePre = fs.readFileSync("tinymce/word_pre.html", "utf8");
                var htmlText = fs.readFileSync("index.html", "utf8");
                var htmlSourcePost = fs.readFileSync("tinymce/word_post.html", "utf8");
                response.writeHead(200, 'Content-Type: text/html' );
                response.write(htmlSourcePre, "utf8");
                response.write(encoder.htmlEncode(htmlText), "utf8");
                response.end(htmlSourcePost, "utf8");
        }
    } else {
	    var extname = path.extname(filePath);
	    var contentType = 'text/html';
	    switch (extname) {
	        case '.js':
	            contentType = 'text/javascript';
	            break;
	        case '.css':
	            contentType = 'text/css';
	            break;
	        case '.jpg':
	            contentType = 'image/jpeg';
	            break;
	        case '.dae':
	            contentType = 'application/octet-stream';
	            break;
	    }
	     
	    fs.exists(filePath, function(exists) {
	     
	        if (exists) {
	            fs.readFile(filePath, function(error, content) {
	                if (error) {
	                    response.writeHead(500);
	                    response.end();
	                }
	                else {
	                    response.writeHead(200, { 'Content-Type': contentType });
	                    response.end(content, 'utf-8');
	                }
	            });
	        }
	        else {
	            response.writeHead(404);
	            response.end();
	        }
	    });
	}
     
}).listen(8125, "localhost");
 
console.log('Server running at http://localhost:8125/');
