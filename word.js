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
        var word = cheerio.load(fs.readFileSync("htmleditor/word.html", "utf8"));
        var targetFile = requestparse.query.file;
        // Form action change
        /*
        word("form")[0].attribs.action += '?file=' + targetFile;
        console.log(word("form")[0].attribs.action);
        */

        if(request.method=='POST') { // Push data to server
            var body='';
            request.on('data', function (data) {
               body +=data;
            });
            request.on('end',function(){
                console.log('word.html POST');    
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
        } else if(request.method=='GET') { // Page load
            request.on('end',function(){
                console.log('word.html GET');    
                response.writeHead(200, 'Content-Type: text/html' );
                response.end(fs.readFileSync("htmleditor/word.html", "utf8"), "utf8");
            });
        }
    } else if (filePath == './test.html') { // handle test POST request
        var targetFile = requestparse.query.file;

        if(request.method=='POST') { // Push data to server
            var body='';
            request.on('data', function (data) {
                body +=data;
            });
            request.on('end',function(){
                console.log('test.html POST');    
/*
                console.log("\nPOST begin\n\n-----\n"+targetFile+"\n-----\n\n");
                console.log(body);
                console.log("\nPOST end\n\n-----\n"+targetFile+"\n-----\n\n");

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
*/

                fs.writeFileSync(targetFile, body, "utf8");
                response.writeHead(200, 'Content-Type: text/html' );
                response.end(body, "utf8");
                
        	});
        } else if(request.method=='GET') { // Page load
            request.on('end',function(){
                console.log('test.html GET');    
                
                fs.exists(targetFile, function(exists) {
                    
                    if (!exists) {
                        fs.createReadStream('htmleditor/empty.html').pipe(fs.createWriteStream(targetFile));
                    }
                    var filetext = cheerio.load(fs.readFileSync(targetFile, "utf8"));
                    response.writeHead(200, 'Content-Type: text/html' );
                    response.end(filetext("body"), "utf8");
                    console.log(targetFile);
                    console.log(filetext("body"));
                    
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
