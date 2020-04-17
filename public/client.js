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
        if (msg.roomID === activeRoom) {
            renderMessage(msg.msg);
        }
    });

    var activeRoom;
    var rooms;

    socket.on('populate rooms', function(rms) {
        rooms = rms;
        // console.log('chat rooms populated');
        $('#chat-rooms').append($('<li class="list-group-item active">').text(rooms[0].name)
            .attr("id", rooms[0].id));
        activeRoom = rooms[0].id;
        rooms[0].history.forEach(function(msg) {
            renderMessage(msg);
        });
        for (i = 1; i < rooms.length; i++) {
            $('#chat-rooms').append($('<li class="list-group-item">').text(rooms[i].name)
                .attr("id", rooms[i].id));
        }
        $(".list-group-item").on("click",function(){
            $(".list-group-item.active").removeClass('active');
            $(this).addClass('active');
            activeRoom = $(".list-group-item.active").attr("id");
            console.log('active room = ' + activeRoom);
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

    socket.on('update history', function(rms) {
        rooms = rms;
    });

    function renderMessage(msg) {
        $('#messages').append($('<li class="list-group-item">').text(msg.timestamp));
        $('#messages li:last').append($('<div class="name">').text(msg.name));
        $('#messages li:last').append($('<div class="msg">').text(msg.text));
    }

    //Populate the bookshelf when the page loads
    // TODO: Is this async? should it be called again or will it update because it is connected to the system? -C
    populateShelf();

    //Populate the map when the page loads
    populateMap();

    //Populate the books around sidebar when the page loads
    populateBooksAround();
});
