// var socket = io();
// console.log('client.js loaded');

$(function () {

    console.log('chat function entered');
    var socket = io();

    $('form').submit(function(e) {
        console.log('form submission successful');
        e.preventDefault();
        socket.emit('chat message', {
            text: $('#message-box').val(),
            roomID: activeRoom
        });
        $('#message-box').val('');
        return false;
    });

    socket.on('chat message', function(msg) {
        // console.log('client chat function called');
        // console.log(typeof msg.roomID, typeof activeRoom);
        if (msg.roomID === activeRoom) {
            renderMessage(msg.msg);
        }
    });

    var activeRoom;
    var activeAdminRoom;
    var rooms;
    var adminRooms;

    socket.on('populate rooms', function(rms) {
        rooms = rms;
        activeRoom = Object.keys(rooms)[0];
        // console.log('chat rooms populated');
        // $('#chat-rooms').append($('<li class="list-group-item active">').text(rooms[activeRoom].name)
        //     .attr("id", rooms[activeRoom].id));
        console.log(activeRoom);
        rooms[activeRoom].history.forEach(function(msg) {
            renderMessage(msg);
        });
        for (var key in rooms) {
            $('#chat-rooms').append($('<li class="list-group-item">').text(rooms[key].name)
                .attr("id", rooms[key].id));
        }
        $('#' + activeRoom).addClass('active');
        $(".list-group-item").on("click",function(){
            $(".list-group-item.active").removeClass('active');
            $(this).addClass('active');
            activeRoom = $(".list-group-item.active").attr("id");
            // console.log('active room = ' + activeRoom);
            $('#messages').empty();
            rooms[parseInt(activeRoom)].history.forEach(function(msg) {
                renderMessage(msg);
            });
            // populate chat message history for this chat room
            // should set a variable to track the active chat room id
            // so when messages are sent, they get sent to only that chat room
            // need to set id when populating the list of chat rooms
        });

    });

    socket.on('admin populate rooms',function(rms) {
        adminRooms = rms;
        activeAdminRoom = Object.keys(adminRooms)[0];
        adminRooms[activeAdminRoom].history.forEach(function(msg) {
            renderAdminMessage(msg);
        });
        for (var key in adminRooms) {
            $('#admin-chat-rooms').append($('<li class="list-group-item">').text(adminRooms[key].name)
                .attr("id", adminRooms[key].id));
        }
        $('#' + activeAdminRoom).addClass('active');
        $(".list-group-item").on("click", async function(){
            $(".list-group-item.active").removeClass('active');
            $(this).addClass('active');
            activeAdminRoom = $(".list-group-item.active").attr("id");
            
            const statusU1 = await checkIfNotBanned((adminRooms[parseInt(activeAdminRoom)].user1Id).replace("user_",""));
            const statusU2 = await checkIfNotBanned((adminRooms[parseInt(activeAdminRoom)].user2Id).replace("user_",""));

            $('#banFirstUser').text( statusU1 + " " + adminRooms[parseInt(activeAdminRoom)].user1Id);
            $('#banSecondUser').text( statusU2 + " " + adminRooms[parseInt(activeAdminRoom)].user2Id);

            //associate the users id as a value
            $('#banFirstUser').val((adminRooms[parseInt(activeAdminRoom)].user1Id).replace("user_",""));
            $('#banSecondUser').val((adminRooms[parseInt(activeAdminRoom)].user2Id).replace("user_",""));

            $('#adminMessages').empty();
            adminRooms[parseInt(activeAdminRoom)].history.forEach(function(msg) {
                renderAdminMessage(msg);
            });
        });
    });

    function renderAdminMessage(msg) {
        $('#adminMessages').append($('<li class="list-group-item">').text(msg.timestamp));
        $('#adminMessages li:last').append($('<div class="name">').text(msg.name));
        $('#adminMessages li:last').append($('<div class="msg">').text(msg.text));
    }

    socket.on('update history', function(rms) {
        rooms = rms;
    });

    function renderMessage(msg) {
        $('#messages').append($('<li class="list-group-item">').text(msg.timestamp));
        $('#messages li:last').append($('<div class="name">').text(msg.name));
        $('#messages li:last').append($('<div class="msg">').text(msg.text));
    }
});
