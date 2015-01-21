var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var twitter = require('ntwitter');
var readline = require('readline');
var credentials = require('./credentials.js');

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

var Entry = require('./entry.js');
var Collection = require('./collection.js');
var collection = new Collection();
var n = 1; //default to 1 min refresh

var twit = new twitter({
    consumer_key: credentials.consumer_key,
    consumer_secret: credentials.consumer_secret,
    access_token_key: credentials.access_token_key,
    access_token_secret: credentials.access_token_secret
});


twit.stream(
    'statuses/sample',  
    function(stream) {
        stream.on('data', function(tweet) {
					if (tweet.retweeted_status) {
						collection.add(tweet);
						collection.remove(n);
						io.emit("new tweet", collection.topTen());
					}
        });
    }
);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
	rl.question("Please enter the number of minutes retweets are tracked\n", function(answer) {
		n = parseInt(answer);
		rl.close();
	});
	
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});


http.listen(3000, function(){
  console.log('listening on *:3000');
});