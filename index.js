const WebSocket = require('ws');
var express = require('express');
const chalk = require('chalk');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server); 

var json = {
    "title": "",
    "artist": "",
    "dur": "",
    "time": "",
    "state": 2,
}

const wss = new WebSocket.Server({ port: 8974 });
console.log(chalk.bgGreen.white('websockets')+chalk.blue(' started on port 8974'));

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    //console.log('received: %s', message);

    if(message.split(/:(.+)/)[0] == "TITLE")
        json.title = message.split(/:(.+)/)[1];

    if(message.split(/:(.+)/)[0] == "ARTIST")
        json.artist = message.split(/:(.+)/)[1]

    if(message.split(/:(.+)/)[0] == "DURATION")
        json.dur = message.split(/:(.+)/)[1];

    if(message.split(/:(.+)/)[0] == "POSITION")
        json.time = message.split(/:(.+)/)[1];

    if(message.split(/:(.+)/)[0] == "STATE")
        json.state = message.split(/:(.+)/)[1];    
  }); 
});


server.listen(8080);
console.log(chalk.bgGreen.white('socket.io') + chalk.blue(' started on port 8080'));
app.use(express.static('public'))

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});
console.log(chalk.bgGreen.white('webserver') + chalk.blue(' started on port 8080'));



io.on('connection', function (socket) {
    socket.emit('ping', {status: "connect"});
    socket.on('pong', function (data) {
      //console.log(data);
    });
  });
  
  

setInterval(function(){
    io.emit('message', JSON.stringify(json));
    //console.log(json)
},1000)

console.log(chalk.green('\n\n\nOverlay Address: http://localhost:8080'));
console.log(chalk.gray("To close, press 'ctrl+c'."));