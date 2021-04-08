/************************** SENG513 Final Project ***************************
       _____ ____  _      _               ____   ____   ____  _  __ _____
     / ____/ __ \| |    | |        /\   |  _ \ / __ \ / __ \| |/ // ____|
    | |   | |  | | |    | |       /  \  | |_) | |  | | |  | | ' /| (___
    | |   | |  | | |    | |      / /\ \ |  _ <| |  | | |  | |  <  \___ \
    | |___| |__| | |____| |____ / ____ \| |_) | |__| | |__| | . \ ____) |
    \_____\____/|______|______/_/    \_|____/ \____/ \____/|_|\_|_____/

            ______......-----~~~~~~~--..__   __..--~~~~~~~-----......______
          //   Members:                   `V'                            \\
        //        Jasmine Cronin          |           Ashley Millette    \\
      //       Brandt Davis              |         Siobhan O’Dell        \\
    //     Patrick Matchett             |        Kent Wong               \\
  //_______......------~~~~~~~~--..__  | __..--~~~~~~~~-----......_______\\
//_______..........------~~~~~~...__\ | /__...~~~~~~------........_______\\
===================================\\|//===================================
                                  `----`
                          Created On: 06/04/2020
                        Last revision: 19/04/2020
****************************************************************************/
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const db = require('./queries');
const port = 3000;
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');
const cookieParser = require("cookie-parser");
app.use(cookieParser());

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
//app.get('/get', (request, response) => {
  //  response.json({ info: 'postgres node api' })
//});


// DATABASE API END POINTS
// ADD AN END POINT HERE AND CORRESPONDING CALL IN PUBLIC/api.js
// EDIT LOGIC/QUERY IN /queries.js
// as for good practice, the client/front facing should never write or call direct sql
app.get('/tables/booktable', db.getBookTable);
app.get('/tables/chattable', db.getChatTable);
app.get('/tables/usertable', db.getUserTable);
app.post('/tables/addrecord/chat', db.addRecordChat);
app.post('/tables/addrecord/book', db.addRecordBook);
app.post('/tables/addrecord/user', db.addRecordUser);
app.put('/tables/uprecord/', db.updateRecord);
app.get('/tables/getrecord/', db.getARecord);
app.delete('/tables/delrecord/', db.delARecord);
app.get('/tables/useridlookup/', db.getUserLookUp);
app.get('/tables/useremaillookup/', db.getUserByEmail);
app.get('/tables/booktitle/', db.getBookTitle);
app.get('/tables/bookauthor/', db.getBookAuthor)
// end of API end points

//login end point
app.post('/login', loginHandler);

//setup list of currently logged in users
//TODO: add method of detecting users who disconnect and remove the id from the list (maybe have a timeout if no logout request sent)
let activeUsers = [];

async function loggedIn(userId){
  for(id of activeUsers){
    if(id === userId){
      return true;
    }
  }
  return false;
}

//TODO: set up a method so that if no cookies always go to login screen, if cookies skip login screen
//bellow is an example of testing for a cookie before sending the file
app.get('/landing.html', async function(request, response) {
	if (await loggedIn(parseInt(request.cookies.user_id))) {
    console.log("they good");
		response.sendFile(path.join(__dirname + "/protected/landing.html"));
	} else {
    console.log("to the login");
		response.sendFile(path.join(__dirname + "/public/index.html"));
	}
});

//TODO: set a large random number instead of user id as the cookie
async function loginHandler(request, response){
  const req = request.body;
  let users = await axiosapicall.apiGetUserEmail(req.email);
  //found a user with the given email
  if(users.length !== 0){
    let user = users[0];
    if(user.password === req.password){
      if(user.user_status === 'a'){
        //setting the cookies
        response.cookie("user_id", user.user_id);
        response.cookie("user_lat", user.user_lat);
        response.cookie("user_lon", user.user_lon);
        response.cookie("user_type", user.user_type);
        activeUsers.push(user.user_id);
        let destination = "http://localhost:3000/landing.html";
        response.status(200).json({"result" : "success", "location" : destination});
        //will not work if using ajax
        //response.redirect(302, '/landing.html');
      }
      //user is banned
      else{
        response.status(200).json({"result" : "banned"});
      }
    }
    //invalid password
    else{
      response.status(200).json({"result" : "login failed"});
    }
  }
  //no user with the given email
  else{
    response.status(200).json({"result":"login failed"});
  }
}

io.on('connection', async function(socket) {

    // To build the chat history for the current user
    var username = -1;
    var chatrooms = [];
    // Get the table containing chat histories
    const allChats = await axiosapicall.apiGetChatTable();

    // Get the user_id from the client's cookie and create the username
    socket.on('login', async function(userID) {
        username = parseInt(userID);

        //TODO: use DB queries to find chats for the active user
        for (var key in allChats) {

            var user1 = allChats[key].firstp_id;
            var user2 = allChats[key].secondp_id;

            var roomname; // Name of chat room to be displayed
            let userid;

            // Get all chats that the current user has participated in
            if (username === user1) {
                roomname = user2;
                // Get user ids for user table
                userid = user2;
            } else if (username === user2) {
                roomname = user1;
                // Get user ids for user table
                userid = user1;
            } else {
                continue;
            }


            // Get user's real name for the chat room list
            var record = {
                "user_id_value" : userid
            }
            var result = await axiosapicall.apiGetUserLookUp(record);
            let firstname = result[0].first_name;
            let lastname = result[0].last_name;
            var realname = firstname + " " + lastname;

            // Build the chat room object
            var room = {
                name: roomname,
                roomLabel: realname,
                visitorUserId: roomname,
                id: allChats[key].chat_id,
                history: JSON.parse(allChats[key].chat_history)
            }

            // Add the chat room to the chat room dictionary
            chatrooms[allChats[key].chat_id] = room;
        }

        // Join the user to all their chats
        for (var key in chatrooms) {
            socket.join(chatrooms[key].id);
        }
        console.log(chatrooms.length);
        //if the user has atleast 1 chat send the message
        if(chatrooms.length > 0){
          console.log("sending message to populate rooms");
          // Tell the client to render the list of chat rooms and their message history
          socket.emit('populate rooms', chatrooms);
        }



        //---ADMIN---
        //TODO: make it so this is only sent to admins, not everyone and then hidden on client side
        var adminChatrooms = {};
        for (var key in allChats) {

          // Get users ids for the chat room list
            var user1 = allChats[key].firstp_id;
            var user2 = allChats[key].secondp_id;

            // Build the admin chat room object
            var room = {
                name: user1 + " and " + user2,
                user1Id: user1,
                user2Id: user2,
                id: allChats[key].chat_id,
                history: JSON.parse(allChats[key].chat_history)
            }

            // Add the chat room to the chat room dictionary
            adminChatrooms[allChats[key].chat_id] = room;
        }
        //if there are any chatrooms to be sent to the admins
        if(adminChatrooms.length > 0){
          socket.emit('admin populate rooms', adminChatrooms);
        }
    });
    //^^^ADMIN^^^

    // When user submits text through the chat box
    socket.on('chat message', async function(msg) {
        // Get timestamp
        var momentTimestamp = moment().format("h:mm:ss a");

        // Get real name of user for message rendering
        var userid = username;
        var record = {
            "user_id_value" : userid
        }
        var result = await axiosapicall.apiGetUserLookUp(record);
        let firstname = result[0].first_name;
        let lastname = result[0].last_name;
        var realname = firstname + " " + lastname;

        // Build chat message object
        var chatMessage = {
            name: username,
            messageLabel: realname,
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
        backupToDB(chatrooms[msg.roomID], msg.roomID);
    });

    socket.on('disconnect', async function() {

        // Parse the message history and write to the database
        for (var key in chatrooms) {
            backupToDB(chatrooms[key], key);
        }
    });

    async function backupToDB(chat, index){
      let hist = JSON.stringify(chat.history);
      let recordUpdate = {
          "tablename" : "chat_table",
          "cell_d" : "chat_history",
          "cell_v" : hist,
          "where_d" : "chat_id",
          "where_v" : index
      };
      await axiosapicall.apiUpdateRecord(recordUpdate);
    }

    //when a request for a new chat room is made
    socket.on("createRoom", async function(users){
      console.log("in createRoom");
      user1 = users.userOne;
      user2 = users.userTwo;
      //if a chat already exists for these users do not create a new one
      for(chat of allChats){
        if((chat.firstp_id === user1 && chat.secondp_id === user2)||
            (chat.firstp_id === user2 && chat.secondp_id === user1)){
              return;
        }
      }
      //creating the new chat
      let momentTimestamp = moment().format("h:mm:ss a");
      let firstMessage = [{
          name: "Automated Message",
          messageLabel: "Automated Message",
          text: "Start of conversation",
          timestamp: momentTimestamp
      }];
      let messageToSend = JSON.stringify(firstMessage);
      let newChat = {
        "firstpname":user1,
        "secondpname":user2,
        "hist": messageToSend
      };
      console.log("adding a new chat");
      console.log(newChat);
      let newId = await axiosapicall.apiAddRecordChatTable(newChat);
      newId = newId[0].chat_id;
      updateChatList(newId, user2, messageToSend);
    });

    async function updateChatList(chatId, secondUser, chatHistory){
      var roomname = secondUser;
      // Get user ids for user table
      var userid = roomname;
      var record = {
          "user_id_value" : userid
      }

      // Get user's real name for the chat room list
      var result = await axiosapicall.apiGetUserLookUp(record);
      let firstname = result[0].first_name;
      let lastname = result[0].last_name;
      var realname = firstname + " " + lastname;

      // Build the chat room object
      var room = {
          name: roomname,
          roomLabel: realname,
          visitorUserId: roomname,
          id: chatId,
          history: JSON.parse(chatHistory)
      }

      // Add the chat room to the chat room dictionary
      chatrooms[room.id] = room;
      socket.join(chatId);
      socket.emit("add room", chatrooms);
    }

    // Resent the chat record to the client
    function updateHistory() {
        io.emit('update history', chatrooms);
    }
});

// NOT app.listen
http.listen(port, () => {
    console.log(`App running on ${port}.`);
});
