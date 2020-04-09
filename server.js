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

// var path = require('path');
var express = require('express');
var app = express();
// var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

// var dir = path.join(__dirname, 'public');

app.use(express.static('public'));

// app.get('/', function(req, res) {
//     res.sendFile(__dirname + '/index.html');
// });

io.on('connection', function(socket) {
    console.log('a user connected');
    socket.on('chat message', function(msg) {
        console.log('message: ' + msg);
    });

    socket.on('disconnect', function() {
        console.log('user disconnected');
    });
});

// NOT app.listen
http.listen('3000', function() {
    console.log('listening on *:3000');
});