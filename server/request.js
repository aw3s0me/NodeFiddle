var url = require('url');
//var debug = require('debug')('server:request');
var log = require('winston');

module.exports = function(req, res) {
    log.info(req.method, req.url);
    var parsedUrl = url.parse(req.url, true);
        //var parsedUrl = url.parse(req.url); //не разбирает выражение
    if (req.method == 'GET' && parsedUrl.pathname == '/echo' && parsedUrl.query.message) {
        var message = parsedUrl.query.message;
        log.debug('Echo: ' + message);
        res.end(message);
        return;
    }
    log.error('Unknown URL');
    res.statusCode = 404;
    res.end('Not found with pathname: ' + parsedUrl.pathname);
};