var http = require('http');
var fs = require('fs'); //filesystem functionality
var mime = require('mime'); //provides ability to derive a MIME type based on a filename extension
var path = require('path');
var chatServer = require('./lib/chat_server');
var cache = {}; //is where the contents of cached files are stored

function send404(response) {

    //Sends a response header to the request.
    //This method must only be called once on a message
    response.writeHead(404, {'Content-Type': 'text/plain'});
    //response.write(chunk, [encoding])
    //1. send writeHead and the first body to the client
    //2. node assumes that you re streaming
    response.write('Error 404: Resourse not found'); //send chunk of response body //may be called multiple times to send WHOLE body

    //response.end(), MUST be called on each response.
    response.end(); //signals to the server that all data and header have been sent
}

function sendFile(response, filePath, fileContents) {
    response.writeHead(200, {'content-type' : mime.lookup(path.basename(filePath))}); //write header
    response.end(fileContents); //send content of the file
}

function serveStatic(response, cache, absPath) {
    if (cache[absPath]) { //check if cached in memory
        sendFile(response, absPath, cache[absPath]); //serve from memory
    }
    else {
        fs.exists(absPath, function(exists){ 
            if (exists) {
                fs.readFile(absPath, function(err, data) {
                    if (err) {
                        send404(response);
                    }
                    else {
                        cache[absPath] = data;
                        sendFile(response, absPath, data);
                    }
                });
            }
            else {
                send404(response);
            }
        });
    }
}

var server = http.createServer(function(request, response) {
    var filePath = false;

    if (request.url == '/') {
        filePath = 'public/index.html'; //determine html file to be served by default
    }
    else {
        filePath = 'public' + request.url;
    }

    var absPath = './' + filePath;
    console.log(absPath);
    serveStatic(response, cache, absPath);
});

chatServer.listen(server);

server.listen(3000, function() {
    console.log('Server listening on port 3000');
});