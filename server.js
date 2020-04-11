/********** SENG513 Final Project **********
 *  Members: Jasmine Cronin
 *           Brandt Davis
 *           Patrick Matchett
 *           Ashley Millette
 *           Siobhan O’Dell
 *           Kent Wong
 *  Created On: 06/04/2020
 *  Last revision: 07/04/2020
 ********************************************/

var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var moment = require("moment");

app.use(express.static('public'));

io.on('connection', function(socket) {
    console.log('a user connected');
    socket.on('chat message', function(msg) {
        var momentTimestamp = moment().format("h:mm:ss a");
        var chatMessage = {
            text: msg,
            timestamp: momentTimestamp
        }
        // console.log('message: ' + msg);
        io.emit('chat message', chatMessage);
    });

    socket.on('disconnect', function() {
        console.log('user disconnected');
    });
});

// NOT app.listen
http.listen('3000', function() {
    console.log('listening on *:3000');
});