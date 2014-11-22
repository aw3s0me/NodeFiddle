var socketio = require('socket.io');
var io;
var guestNumber = 1;
var nickNames = {};
var namesUsed = {};
var currentRoom = {};

function assignGuestName(socket, guestNumber, nickNames, namesUsed) {
    var name = 'Guest' + guestNumber;
    nickNames[socket.id] = name;
    socket.emit('nameResult', {
        'success': true,
        name: name
    });
    namesUsed.push(name);
    return guestNumber + 1;
}

function joinRoom(socket, room) {
    socket.join(room);
    currentRoom[socket.id] = room;
    socket.emit('joinResult', {room: room});
    socket.broadcast.to(room).emit('message', {
        text: nickNames
    })
}




exports.listen = function(server) {
    io = socketio.listen(server); //start socket io server
    io.set('log level', 1);

    io.sockets.on('connection', function(socket){
        guestNumber = assignGuestName(socket, guestNumber, nickNames, namesUsed);
        joinRoom(socket, 'Lobby');

        handleMessageBroadcasting(socket, nickNames); //handle user message, name change, room creation/changes
        handleNameChangeAttempts(socket, nickNames, namesUsed); //
        handleRoomJoining(socket);

        socket.on('rooms', function(){
            socket.emit('rooms', io.sockets.manager.rooms); //provides user with list of occupied rooms on request
        });

        handleClientDisconnection(socket, nickNames, namesUsed);
    });

};