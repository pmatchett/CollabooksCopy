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
// the axios api to use the REST calls to get DB information
// to use, just call axiosdbcall.apiGetChatTable() for example
const axiosapicall = require('./axiosapi');

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

io.on('connection', async function(socket) {
    // console.log('a user connected');

    // var username = "user_" + Math.floor(Math.random() * 100);
    var username = "user_51";

    var chatrooms = {};

    const allChats = await axiosapicall.apiGetChatTable();
    // console.log(allChats[0].chat_id);
    // console.log('chat data retrieved: ' + allChats[0].chat_id);
    for (var key in allChats) {
        // console.log(allChats[key].chat_id);
        // console.log(allChats[key].first_participant_username);
        // console.log(allChats[key].second_participant_username);
        var user1 = allChats[key].first_participant_username;
        // console.log(typeof(username));
        var user2 = allChats[key].second_participant_username;
        // console.log(user2);
        var roomname;
        // console.log('username = ' + username + ", user1 = " + user1 + ", user2 = " + user2);
        if (username === user1) {
            roomname = user2;
            // console.log(roomname);
        } else if (username === user2) {
            roomname = user1;
        } else {
            continue;
        }

        // console.log(roomname);

        var room = {
            name: roomname,
            id: allChats[key].chat_id,
            history: JSON.parse(allChats[key].chat_history)
        }

        // console.log(room.history);

        chatrooms[room.id] = room;
    }

    for (var key in chatrooms) {
        socket.join(chatrooms[key].id);
    }
    socket.emit('populate rooms', chatrooms);

    //---ADMIN---
    //Would be ALL chatrooms sent, Not dynamic
    socket.emit('admin populate rooms', chatrooms);
    //^^^ADMIN^^^

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

    socket.on('disconnect', async function() {
        // console.log('user disconnected');
        for (var key in chatrooms) {
            // console.log(key);
            let hist = JSON.stringify(chatrooms[key].history);
            let recordUpdate = {
                "tablename" : "chat_table",
                "cell_d" : "chat_history",
                "cell_v" : hist,
                "where_d" : "chat_id",
                "where_v" : key
            };
            // let update = JSON.stringify(recordUpdate);
            console.log(recordUpdate);
            // construct the new record
            // { "tablename" : "book_table",
            //     "cell_d" : "title",
            //     "cell_v" : 'dank memes',
            //     "where_d" : "book_id",
            //     "where_v" : "1000",
            // }
            await axiosapicall.apiUpdateRecord(recordUpdate);
        }
    });

    function updateHistory() {
        io.emit('update history', chatrooms);
    }
});

// NOT app.listen
http.listen(port, () => {
    console.log(`App running on ${port}.`)
});
