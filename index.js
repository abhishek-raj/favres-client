var http = require('http');
var fs = require('fs');
var path = require('path');
var port = process.env.PORT || 8125;

http.createServer(function (request, response) {
console.log('request starting...');

var filePath = '.' + request.url;
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
    case '.json':
        contentType = 'application/json';
        break;
    case '.png':
        contentType = 'image/png';
        break;      
    case '.jpg':
        contentType = 'image/jpg';
        break;
    case '.wav':
        contentType = 'audio/wav';
        break;
}

fs.readFile(filePath, function(error, content) {
    if (error) {
        if(error.code == 'ENOENT'){
            response.writeHead(404, {'Content-Type': 'text/plain'});
            response.end('Page not found');
        }
        else {
            response.writeHead(500);
            response.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
            response.end(); 
        }
    }
    else {
        response.writeHead(200, { 'Content-Type': contentType });
        response.end(content, 'utf-8');
    }
});

}).listen(port);
console.log('Server running at http://127.0.0.1:/'+port);