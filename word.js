var http = require('http');
var fs = require('fs');
var path = require('path');
var qs = require('querystring');
 
http.createServer(function (request, response) {
 
    console.log("request %s", request.url);

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
     
        var filePath = '.' + require('url').parse(request.url, true).pathname;
	//    var filePath = '.' + url.parse(request.url);
	    if (filePath == './')
	        filePath = './index.html';
	         
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
	     
	    path.exists(filePath, function(exists) {
	     
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