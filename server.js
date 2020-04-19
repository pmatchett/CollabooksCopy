/********** SENG513 Final Project **********
 *  Members: Jasmine Cronin
 *           Brandt Davis
 *           Patrick Matchett
 *           Ashley Millette
 *           Siobhan O’Dell
 *           Kent Wong
 *  Created On: 06/04/2020
 *  Last revision: 19/04/2020
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

app.use(express.static('public')); // serving static web pages, .css, .html files

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
app.get('/tables/useridlookup/', db.getUserLookUp);
// end of API end points

io.on('connection', async function(socket) {

    // To build the chat history for the current user
    var username = "user_";
    var chatrooms = {};

    // Get the user_id from the client's cookie and create the username
    socket.on('login', function(userID) {
        username += userID;
    });

    // Get the table containing chat histories
    const allChats = await axiosapicall.apiGetChatTable();

    for (var key in allChats) {

        var user1 = allChats[key].first_participant_username;
        var user2 = allChats[key].second_participant_username;

        var roomname; // Name of chat room to be displayed

        // Get all chats that the current user has participated in
        if (username === user1) {
            roomname = user2;
        } else if (username === user2) {
            roomname = user1;
        } else {
            continue;
        }

        // Build the chat room object
        var room = {
            name: roomname,
            visitorUserId: roomname,
            id: allChats[key].chat_id,
            history: JSON.parse(allChats[key].chat_history)
        }

        // Add the chat room to the chat room dictionary
        chatrooms[room.id] = room;
    }

    // Join the user to all their chats
    for (var key in chatrooms) {
        socket.join(chatrooms[key].id);
    }

    // Tell the client to render the list of chat rooms and their message history
    socket.emit('populate rooms', chatrooms);

    //---ADMIN---
    var adminChatrooms = {};
    for (var key in allChats) {

        var user1 = allChats[key].first_participant_username;
        var user2 = allChats[key].second_participant_username;

        var room = {
            name: user1 + " and " + user2,
            user1Id: user1,
            user2Id: user2,
            id: allChats[key].chat_id,
            history: JSON.parse(allChats[key].chat_history)
        }
        adminChatrooms[room.id] = room;
    }

    socket.emit('admin populate rooms', adminChatrooms);
    //^^^ADMIN^^^

    // When user submits text through the chat box
    socket.on('chat message', function(msg) {
        // Get timestamp
        var momentTimestamp = moment().format("h:mm:ss a");

        // Build chat message object
        var chatMessage = {
            name: username,
            text: msg.text,
            timestamp: momentTimestamp
        }

        // Add chat message to the history for the room the message was sent in
        chatrooms[msg.roomID].history.push(chatMessage);

        // Only store the latest 200 messages for each room
        if (chatrooms[msg.roomID].history.length > 200) chatrooms[msg.roomID].history.shift();

        // Emit the message object to all users in the chat room for rendering
        io.to(msg.roomID).emit('chat message', {
                msg: chatMessage,
                roomID: msg.roomID
            }
        );

        // Resend the chat record to the client
        updateHistory();
    });

    socket.on('disconnect', async function() {

        // Parse the message history and write to the database
        for (var key in chatrooms) {
            let hist = JSON.stringify(chatrooms[key].history);
            let recordUpdate = {
                "tablename" : "chat_table",
                "cell_d" : "chat_history",
                "cell_v" : hist,
                "where_d" : "chat_id",
                "where_v" : key
            };
            await axiosapicall.apiUpdateRecord(recordUpdate);
        }
    });

    // Resent the chat record to the client
    function updateHistory() {
        io.emit('update history', chatrooms);
    }
});

// NOT app.listen
http.listen(port, () => {
    console.log(`App running on ${port}.`)
});
