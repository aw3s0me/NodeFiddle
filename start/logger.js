//var log = require('my_module')(module);

module.exports = function(module) {
    return function() {
        var args = [module.filename].concat([].slice.call(arguments));
        console.log.apply(console, args);
    };
};