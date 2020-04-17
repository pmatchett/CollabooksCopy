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


const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const db = require('./queries');
const port = 3000;

const http = require('http').createServer(app);
const io = require('socket.io')(http);
var moment = require("moment");

// var dir = path.join(__dirname, 'public');

app.use(express.static('public'));
// for postgres api
app.use(
    bodyParser.urlencoded({
        extended: true,
    }),
    bodyParser.json({
        extended: true,
})
);

// on a get request, return json
// simple test localhost:3000/get
app.get('/get', (request, response) => {
    response.json({ info: 'postgres node api' })
});

// DATABASE API END POINTS
// ADD AN END POINT HERE AND CORRESPONDING CALL IN PUBLIC/api.js
// EDIT LOGIC/QUERY IN /queries.js
// as for good practice, the client/front facing should never write or call direct sql
app.get('/tables/booktable', db.getBookTable);
app.get('/tables/chattable', db.getChatTable);
app.get('/tables/usertable', db.getUserTable);
app.post('/tables/addrecord/book', db.addRecordBook);
app.post('/tables/addrecord/user', db.addRecordUser);
app.put('/tables/uprecord/', db.updateRecord);
app.get('/tables/getrecord/', db.getARecord);
app.delete('/tables/delrecord/', db.delARecord);
// end of API end points

// will need to populate the list of chatrooms from existing database history
// var chatrooms = ['chatroom1', 'chatroom2', 'chatroom3'];
var chatrooms = [];
for (i = 0; i < 3; i++) { //change this to traverse sql query of chat rooms
    var room = {
        name: 'User' + i,
        id: i,
        history: [
            {
                name: "username test " + i,
                text: "Message 1 for chat room " + i,
                timestamp: 'fake timestamp  1'
            },
            {
                name: "username test " + i,
                text: "Message 2 for chat room " + i,
                timestamp: 'fake timestamp  2'
            },
            {
                name: "username test " + i,
                text: "Message 3 for chat room " + i,
                timestamp: 'fake timestamp  3'
            },
            {
                name: "username test " + i,
                text: "Message 4 for chat room " + i,
                timestamp: 'fake timestamp  4'
            }
        ]
    };
    chatrooms.push(room);
}

io.on('connection', function(socket) {
    console.log('a user connected');

    var username = "User" + Math.floor(Math.random() * 1000);
    for (i = 0; i < chatrooms.length; i++) {
        socket.join(chatrooms[i].id);
    }
    socket.emit('populate rooms', chatrooms);

    socket.on('chat message', function(msg) {
        var momentTimestamp = moment().format("h:mm:ss a");
        var chatMessage = {
            name: username,
            text: msg.text,
            timestamp: momentTimestamp
        }
        chatrooms[msg.roomID].history.push(chatMessage);
        if (chatrooms[msg.roomID].history.length > 200) chatrooms[msg.roomID].history.shift();
        // console.log('message: ' + msg);
        io.to(msg.roomID).emit('chat message', {
                msg: chatMessage,
                roomID: msg.roomID
            }
        );
        updateHistory();
    });

    socket.on('disconnect', function() {
        console.log('user disconnected');
    });

    function updateHistory() {
        io.emit('update history', chatrooms);
    }
});

// NOT app.listen
http.listen(port, () => {
    console.log(`App running on ${port}.`)
});