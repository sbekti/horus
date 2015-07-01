var express = require('express');
var socketio = require('socket.io');
var favicon = require('serve-favicon');
var http = require('http');
var path = require('path');

var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);

var users = {};
var chatHistory = [];

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon(__dirname + '/public/favicon/favicon.ico'));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
  res.render('index');
});

io.on('connection', function (socket) {
  socket.on('user:location', function(data) {
    users[data.username] = data;
    socket.username = data.username;
    io.emit('user:location', data);
  });

  socket.on('chat:message', function(data) {
    chatHistory.push(data);

    if (chatHistory.length > 200) {
      chatHistory.shift();
    }

    io.emit('chat:message', data);
  });

  socket.on('chat:history', function() {
    socket.emit('chat:history', chatHistory);
  });

  socket.on('disconnect', function() {
    if (socket.username != undefined) {
      delete users[socket.username];
      io.emit('user:disconnect', socket.username);
      console.log(users);
    }
  });
});

server.listen(5000);
