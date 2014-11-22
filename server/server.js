var http = require('http');
var url = require('url');
//var debug = require('debug')('server');
var log = require('winston');

var server = new http.Server();

server.on('request', require('./request'));

/*var counter = 0;

var emit = server.emit;
server.emit = function(event) {
    console.log(event);
    emit.apply(server, arguments);
};

server.on('request', function(req, res) {
    var msg = 'Hello world: ' + ++counter + '\n';
    res.end(msg);
});*/


server.listen(1337, '127.0.0.1');
