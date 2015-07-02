var express = require('express');
var socketio = require('socket.io');
var favicon = require('serve-favicon');
var sanitizeHtml = require('sanitize-html');
var http = require('http');
var path = require('path');

var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);

var users = {};
var chatHistory = [];
var maxHistorySize = 256;
var maxMessageLength = 256;

app.set('port', (process.env.PORT || 5000))

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon(__dirname + '/../public/favicon/favicon.ico'));
app.use(express.static(path.join(__dirname, '/../public')));

app.get('/', function(req, res) {
  res.render('index');
});

io.on('connection', function (socket) {
  // Handles initial user list request
  socket.on('user:list', function() {
    socket.emit('user:list', users);
  });

  // Handles user location update
  socket.on('user:location', function(data) {
    users[data.username] = data;
    socket.username = data.username;
    io.emit('user:location', data);
  });

  // Handles chat messages
  socket.on('chat:message', function(data) {
    data.text = data.text.substring(0, maxMessageLength);
    data.text = sanitizeHtml(data.text, {
      allowedTags: [],
      allowedAttributes: {}
    });

    chatHistory.push(data);

    if (chatHistory.length > maxHistorySize) {
      chatHistory.shift();
    }

    io.emit('chat:message', data);
  });

  // Handles chat history request
  socket.on('chat:history', function() {
    socket.emit('chat:history', chatHistory);
  });

  // Handles user disconnection
  socket.on('disconnect', function() {
    if (socket.username != undefined) {
      delete users[socket.username];
      io.emit('user:disconnect', socket.username);
    }
  });
});

server.listen(app.get('port'), function() {
  console.log('Node app is running at localhost:' + app.get('port'))
})
