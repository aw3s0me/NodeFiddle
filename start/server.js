var user = require('./user');

function run() {
    var vasya = new user.User('Vasya');
    var petya = new user.User('Petya');
    vasya.hello(petya);
}

if (module.parent) {
    exports.run = run;
}
else {
    run(); //не запустится ((
}




