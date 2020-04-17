// var socket = io();
// console.log('client.js loaded');

$(function () {

    console.log('chat function entered');
    var socket = io();

    $('form').submit(function(e) {
        console.log('form submission successful');
        e.preventDefault();
        socket.emit('chat message', $('#message-box').val());
        $('#message-box').val('');
        return false;
    });

    socket.on('chat message', function(msg) {
        $('#messages').append($('<li class="list-group-item">').text(msg.timestamp));
        $('#messages li:last').append($('<div class="name">').text(msg.name));
        $('#messages li:last').append($('<div class="msg">').text(msg.text));
    });

    //Populate the bookshelf when the page loads
    // TODO: Is this async? should it be called again or will it update because it is connected to the system? -C
    populateShelf();

    //Populate the map when the page loads
    populateMap();

    //Populate the books around sidebar when the page loads
    populateBooksAround();
});
