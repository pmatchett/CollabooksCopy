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
});