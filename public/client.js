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

function socketSetup() {

    var socket = io();
    var activeRoom; // ID of active rendered chat room
    var activeAdminRoom; // Same, but admin view
    var rooms; // List of chat room objects
    var adminRooms; // Same, but admin view

    // If a user's cookie exists, extract their user_id and send it to the server
    if (document.cookie.split(';').filter((item) => item.trim().startsWith('user_id=')).length) {
        let userID = document.cookie.replace(/(?:(?:^|.*;\s*)user_id\s*\=\s*([^;]*).*$)|^.*$/, "$1");
        socket.emit('login', userID);
    }

    // When the user submits a message through the chat box, send the message and chat room ID to the server
    $('form').submit(function(e) {
        e.preventDefault(); // To prevent page refresh

        socket.emit('chat message', {
            text: $('#message-box').val(),
            roomID: activeRoom
        });

        // Reset the text box contents
        $('#message-box').val('');
        return false;
    });

    // Render the message object sent back from the server
    // But only if the chat room ID is the one the user has active
    socket.on('chat message', function(msg) {
        if (msg.roomID === activeRoom) {
            renderMessage(msg.msg);
        }
    });

    // Render the given list of chat rooms and chat message history
    socket.on('populate rooms', function(rms) {
        rooms = rms;
        // Set the active room to the first room in the list
        activeRoom = Object.keys(rooms)[0];

        // Render message history for the active room
        rooms[activeRoom].history.forEach(function(msg) {
            renderMessage(msg);
        });

        // Set the ids of all the html tags for the chat rooms
        for (var key in rooms) {
            $('#chat-rooms').append($('<li class="list-group-item chat-room">').text(rooms[key].roomLabel)
                .attr("id", rooms[key].id));
        }

        // Renders a selection highlight on the active room, from Bootstrap
        $('#' + activeRoom).addClass('active');

        $('#lendButton').val((rooms[parseInt(activeRoom)].visitorUserId).replace("user_",""));

        // Change the active room based on what the user clicks on
        $(".chat-room").on("click",function(){
            $(".list-group-item.active").removeClass('active');
            $(this).addClass('active');
            activeRoom = $(".list-group-item.active").attr("id");

            // Empty the message list and re-render with different history
            $('#messages').empty();
            rooms[parseInt(activeRoom)].history.forEach(function(msg) {
                renderMessage(msg);
            });

            $('#lendButton').val((rooms[parseInt(activeRoom)].visitorUserId).replace("user_",""));
        });

    });

    //when a new room is added to the list
    socket.on("add room", function(rms){
      rooms = rms
      let roomDetails = Object.keys(rooms);
      let numRooms = roomDetails.length;
      // Set the active room to the newly added room
      activeRoom = roomDetails[numRooms-1];
      console.log(activeRoom);
        $(".list-group-item.active").removeClass('active');
      $("#messages").empty();
      // Render message history for the active room
      rooms[activeRoom].history.forEach(function(msg) {
          renderMessage(msg);
      });
      $('#chat-rooms').append($('<li class="list-group-item chat-room">').text(rooms[activeRoom].roomLabel)
          .attr("id", rooms[activeRoom].id));

      // Renders a selection highlight on the active room, from Bootstrap
      $('#' + activeRoom).addClass('active');

      $('#lendButton').val((rooms[parseInt(activeRoom)].visitorUserId).replace("user_",""));

      // Change the active room based on what the user clicks on
      $(".chat-room").on("click",function(){
          $(".list-group-item.active").removeClass('active');
          $(this).addClass('active');
          activeRoom = $(".list-group-item.active").attr("id");

          // Empty the message list and re-render with different history
          $('#messages').empty();
          rooms[parseInt(activeRoom)].history.forEach(function(msg) {
              renderMessage(msg);
          });

          $('#lendButton').val((rooms[parseInt(activeRoom)].visitorUserId).replace("user_",""));
      });
    });

    // Render a chat message object
    function renderMessage(msg) {
        $('#messages').append($('<li class="list-group-item">').text(msg.timestamp));
        $('#messages li:last').append($('<div class="name">').text(msg.messageLabel));
        $('#messages li:last').append($('<div class="msg">').text(msg.text));
    }

    // Render the all chat rooms to the admin
    socket.on('admin populate rooms',function(rms) {
        adminRooms = rms;

        // Set the active room to the first room in the list
        activeAdminRoom = Object.keys(adminRooms)[0];

        // Render message history for the active room
        adminRooms[activeAdminRoom].history.forEach(function(msg) {
            renderAdminMessage(msg);
        });

        // Set the ids of all the html tags for the chat rooms
        for (var key in adminRooms) {
            $('#admin-chat-rooms').append($('<li class="list-group-item chat-room">').text(adminRooms[key].name)
                .attr("id", adminRooms[key].id));
        }

        // Renders a selection highlight on the active room, from Bootstrap
        $('#' + activeAdminRoom).addClass('active');

        // Change the active room based on what the user clicks on
        $(".list-group-item").on("click", async function(){
            $(".list-group-item.active").removeClass('active');
            $(this).addClass('active');
            activeAdminRoom = $(".list-group-item.active").attr("id");

            // Get the status of the user
            const statusU1 = await checkIfNotBanned((adminRooms[parseInt(activeAdminRoom)].user1Id).replace("user_",""));
            const statusU2 = await checkIfNotBanned((adminRooms[parseInt(activeAdminRoom)].user2Id).replace("user_",""));

            // Change the button text based on if they are banned or not
            $('#banFirstUser').text( statusU1 + " " + adminRooms[parseInt(activeAdminRoom)].user1Id);
            $('#banSecondUser').text( statusU2 + " " + adminRooms[parseInt(activeAdminRoom)].user2Id);

            // Associate the users id as a value
            $('#banFirstUser').val((adminRooms[parseInt(activeAdminRoom)].user1Id).replace("user_",""));
            $('#banSecondUser').val((adminRooms[parseInt(activeAdminRoom)].user2Id).replace("user_",""));

            // Empty the message list and re-render with different history
            $('#adminMessages').empty();
            adminRooms[parseInt(activeAdminRoom)].history.forEach(function(msg) {
                renderAdminMessage(msg);
            });
        });
    });

    // Render an admin message object
    function renderAdminMessage(msg) {
        $('#adminMessages').append($('<li class="list-group-item">').text(msg.timestamp));
        $('#adminMessages li:last').append($('<div class="name">').text(msg.name));
        $('#adminMessages li:last').append($('<div class="msg">').text(msg.text));
    }

    // Update the chat histories to the current one sent from the server
    socket.on('update history', function(rms) {
        rooms = rms;
    });

    return socket;
}
