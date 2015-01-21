var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var twitter = require('ntwitter');
var credentials = require('./credentials.js');

var twit = new twitter({
    consumer_key: credentials.consumer_key,
    consumer_secret: credentials.consumer_secret,
    access_token_key: credentials.access_token_key,
    access_token_secret: credentials.access_token_secret
});

console.log(credentials.consumer_key)

twit.stream(
	 // "retweeted":true,
    'statuses/filter',
    { track: ['awesome', 'cool', 'rad', 'gnarly', 'groovy'] },
    function(stream) {
        stream.on('data', function(tweet) {
					if (tweet.retweeted_status) {
						// io.emit("new tweet", tweet)
						console.log(tweet.id + " " + tweet.retweeted_status.id)
						console.log(tweet.text + "\n\n " + tweet.retweeted_status.text)
					}
					
            // console.log(tweet.text);
        });
    }
);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

// io.sockets.on("connection", function(socket) {
// 	socket.on("start stream", function)
// })

http.listen(3000, function(){
  console.log('listening on *:3000');
});