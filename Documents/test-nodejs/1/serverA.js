const net = require("net");
var server = require('http').createServer();
var io = require('socket.io')(server);
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var tableify = require('tableify');

app.use(express.static(__dirname + '/public'));  
app.get('/', function(req, res,next) {  
    res.sendFile(__dirname + '/index.html');
});
//socketio connection start
io.on('connection', function(){ 
// Create a socket (client) that connects to the server
var socket = new net.Socket();
socket.connect(61337, "localhost", function () {
    console.log("Client: Connected to server");
});
// Let's handle the data we get from the server
socket.on("data", function (data) {
   data = JSON.parse(data);
   //converting json to html
   var html = tableify(data.response);
   //sending data to the client
    io.emit("mydata",html)
});

socket.on('close', function() {
    socket.destroy();
    //reconnecting server
    setTimeout(function(){
        socket.connect(61337);
    },1000)
    
	console.log('Connection closed ');
});
socket.on('error', function(error) {
    console.log(error)
	console.log('Connection error, please check the connection or try later ');
});

});

server.listen(3000);