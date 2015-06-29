var express = require('express');
var socketio = require('socket.io');
var http = require('http');
var path = require('path');

var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
  res.render('index');
});

io.on('connection', function (socket) {
  socket.on('coords', function (data) {
    io.emit('coords', data);
  });
});

server.listen(5000);
