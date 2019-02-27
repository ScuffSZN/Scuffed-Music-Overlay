const YouTube = require('youtube-live-chat');


var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
//const yt = new YouTube('UCStEQ9BjMLjHTHLNA6cY9vg', 'AIzaSyBnFk3EyETPxEwHn8iO438n9W1JuLc7kGc');
//const yt = new YouTube('UCStEQ9BjMLjHTHLNA6cY9vg', 'AIzaSyAKvXaBGlUpoBbRogd4S7gol4PaOvD7erk');
//const yt = new YouTube('UCNNTZgxNQuBrhbO0VrG8woA', 'AIzaSyAEjf7QlUE6aKHaeHXWAJgU6Dd0hDkp0f4');
const yt = new YouTube('UCPkOhci8gkwL7p6hxIJ2WQw', 'AIzaSyCCeUAQ0R_LpUnVZrQhl3K0lkgNjoHRgNw');
 


server.listen(8080);

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});


var bannedWords = ["ice_posiedon2", "IP2", "iceposeidon_2", "ICP2", "ice_poseidon3", "Ice Poseidon 2","ICE_POSEIDON2"];

yt.on('ready', () => {
  console.log('ready!')
  yt.listen(2500)
})
 
yt.on('message', data => {
  json = {
    "name": data.authorDetails.displayName,
    "message": data.snippet.displayMessage
  }

    result = containsAny(data.snippet.displayMessage, bannedWords)

  if(result == null) {
    //console.log(JSON.stringify(json))
    io.emit('message', JSON.stringify(json));
  }
})
 
yt.stop();

yt.on('error', error => {
  console.error(error)
})


function containsAny(str, substrings) {
  for (var i = 0; i != substrings.length; i++) {
     var substring = substrings[i].toLowerCase();
     str = str.toLowerCase();
     if (str.indexOf(substring) != - 1) {
       return substring;
     }
  }
  return null; 
}





io.on('connection', function (socket) {
  socket.emit('ping', {status: "connect"});
  socket.on('pong', function (data) {
    console.log(data);
  });
});


