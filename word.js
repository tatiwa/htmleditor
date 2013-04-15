var http = require('http');
var fs = require('fs');
var path = require('path');
var htmlbeautify = require('js-beautify').html;

http.createServer(function (request, response) {
 
    console.log("request %s", request.url);
    var requestparse = require('url').parse(request.url, true);
    var filePath = '.' + requestparse.pathname;
    if (filePath == './')
        filePath = './word.html';

    if (filePath == './word.html') {
        if(request.method=='GET') { // Page load
            request.on('end',function(){
                console.log('word.html GET');    
                response.writeHead(200, 'Content-Type: text/html' );
                response.end(fs.readFileSync("htmleditor/word.html", "utf8"), "utf8");
            });
        }
    } else if (filePath == './update.html') { // handle test POST request
        var targetFile = requestparse.query.file;

        if(request.method=='POST') { // Push data to server
            var body='';
            request.on('data', function (data) {
                body +=data;
            });
            request.on('end',function(){
                console.log('update.html POST');
                var htmltext = htmlbeautify(body);  

                fs.writeFileSync(targetFile, htmltext, "utf8");
                response.writeHead(200, 'Content-Type: text/html' );
                response.end(htmltext, "utf8");
                
        	});
        } else if(request.method=='GET') { // Page load
            request.on('end',function(){
                console.log('update.html GET');    
                
                fs.exists(targetFile, function(exists) {
                    if (exists) {
                        console.log("File exists: "+targetFile);
                        response.writeHead(200, 'Content-Type: text/html' );
                        response.end(fs.readFileSync(targetFile, "utf8"), "utf8");
                        console.log(fs.readFileSync(targetFile, "utf8"));
                    }
                    
        	    });

            });
        }

    } else { // Feed regular files
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
	        case '.gif':
	            contentType = 'image/gif';
	            break;
	        case '.ico':
	            contentType = 'image/vnd.microsoft.icon';
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
     
}).listen(8126, "localhost");
 
console.log('Server running at http://localhost:8126/');
