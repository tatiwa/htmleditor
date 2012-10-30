var http = require('http');
var fs = require('fs');
var path = require('path');
var qs = require('querystring');
var Encoder = require('node-html-encoder').Encoder;
var cheerio = require("cheerio");
 
http.createServer(function (request, response) {
 
    console.log("request %s", request.url);
    var requestparse = require('url').parse(request.url, true);
    var filePath = '.' + requestparse.pathname;
    if (filePath == './')
        filePath = './word.html';

    if (filePath == './word.html') {
        var encoder = new Encoder('entity');
        var word = cheerio.load(fs.readFileSync("nodescripts/word.html", "utf8"));
        var targetFile = requestparse.query.file;
        // Form action change
        word("form")[0].attribs.action += '?file=' + targetFile;
        console.log(word("form")[0].attribs.action);

        if(request.method=='POST') {
            var body='';
            request.on('data', function (data) {
               body +=data;
            });
            request.on('end',function(){
                console.log('POST');    
                var POST =  qs.parse(body);
                console.log(POST);    
                var htmlText = POST.elm1;
                console.log(htmlText);

                fs.exists(targetFile, function(exists) {
                    if (exists) {
                        console.log(targetFile);    
                        var filetext = cheerio.load(fs.readFileSync(targetFile, "utf8"));

                        // Replace body and save file
                        filetext("body").replaceWith('<body>\n' + htmlText + '\n</body>');
                        console.log(filetext.html());
                        fs.writeFileSync(targetFile, filetext.html(), "utf8");

                        // Modify browser window
                        word("textarea").replaceWith(
                        	'<textarea id="elm1" name="elm1" rows="15" cols="80" style="width: 100%">' +
                        	htmlText + '</textarea>'
                        );
                    } 
                    response.writeHead(200, 'Content-Type: text/html' );
                    response.end(word("html").html(), "utf8");
        	    });
        	});
        } else if(request.method=='GET') {
            request.on('end',function(){
                console.log('GET');    
                
                fs.exists(targetFile, function(exists) {
                    if (exists) {
                        console.log("Targetfile: " + targetFile);
                        var htmlText = cheerio.load(fs.readFileSync(targetFile, "utf8"));
                        // console.log(htmlText.html());
                        word("title").replaceWith(
                        	'<title>' + htmlText("title").html() + '</textarea>'
                        );
                        var text = encoder.htmlEncode(htmlText("body").html());
                        console.log(text);    
                        // Textarea change
                        word("textarea").replaceWith(
                        	'<textarea id="elm1" name="elm1" rows="15" cols="80" style="width: 100%">' +
                        	text + '</textarea>'
                        );
                    }
                    response.writeHead(200, 'Content-Type: text/html' );
                    response.end(word("html").html(), "utf8");
                    
        	    });

            });
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
