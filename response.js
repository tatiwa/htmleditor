var http = require("http");

http.createServer(function(request, response) {

  console.log('request starting...');


  response.writeHead(200, {"Content-Type": "text/plain"});
  response.write("Hello World");
  response.end();
}).listen(8125, "localhost");