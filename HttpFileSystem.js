var http = require('http');
var fs = require('fs');

var httpserver = http.createServer(onRequest);
httpserver.listen(8124, "127.0.0.1",serverCreated_callback());

function onRequest(request, response){
    var pureUrl = request.url;
    if (pureUrl == '/favicon.ico') 
        return;
    var candidateQS = require('url').parse(request.url)['query'];
    pureUrl = UrlToFsPath(pureUrl);
    
    console.log(pureUrl + ' is requested');
    
    try{
         if (candidateQS != null) {
            // a file is requested
            candidateQS = candidateQS.substr(5,candidateQS.lenght);
            var fileData = fs.readFileSync(candidateQS);
            response.writeHead(200);
            response.write(fileData);
            response.end();
        }
    else {
            var htmlOutput = FormatHtmlFileList(pureUrl);
            response.writeHead(200, {
                'Content-Type': 'text/html'
            });
            response.end(htmlOutput, 'utf8');
        }
        
    }
    catch(error) {
        response.writeHead(404, {
                'Content-Type': 'text/html'
            });
        response.end();
        
    }
    
    
    
}

function serverCreated_callback(){
  console.log('HttpFileSystem Server running at http://127.0.0.1:8124/');
}

function UrlToFsPath(pureUrl){
    if( pureUrl.substr(-1) != "/" ){
        pureUrl += "/";
    }
    return unescape(pureUrl.replace(/\+/g, " "));;      
}

function FormatHtmlTableRow(absolutePath, filename){
     var fileStats = fs.statSync(absolutePath);
     var htmlRow;
     if(fileStats.isFile()){
        htmlRow = "<tr><td>[-]</td><td style='width:300px'><a href='/?file=" + absolutePath + "'>" 
        + filename + "</a> </td><td>" + fileStats['ctime'] + "</td><td>"+ fileStats['size'] +"</td>";
     }
     else{
        htmlRow = "<tr><td>[+]</td><td style='width:300px'><a href='" + absolutePath + "'> " 
        + filename + "</a> </td><td>" + fileStats['ctime'] + "</td>";
     }
     return htmlRow;
}

function FormatHtmlFileList(pureUrl){
    var htmlOutput = '<h3>Folder: ' + pureUrl + '</h3>';
    htmlOutput +="<a href='"+ pureUrl +"' >Go back</a>";
    htmlOutput +='<table>';
    htmlOutput +="<tr><td> </td><td style='width:300px'> Name </td><td>Create Date</td><td>Size</td>";
    var directories = fs.readdirSync(pureUrl);
    for (var i in directories) {
        var absolutePath =  pureUrl + directories[i]
        htmlOutput += FormatHtmlTableRow(absolutePath, directories[i]);
    }
    htmlOutput +='</table>';
    return htmlOutput;
    
}