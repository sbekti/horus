var express = require('express');
var socketio = require('socket.io');
var favicon = require('serve-favicon');
var http = require('http');
var path = require('path');

var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon(__dirname + '/public/favicon/favicon.ico'));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
  res.render('index');
});

io.on('connection', function (socket) {
  socket.on('update', function (data) {
    io.emit('update', data);
  });
});

server.listen(5000);
