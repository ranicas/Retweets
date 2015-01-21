var Entry = require('./entry.js');

Collection = function() {
	this.collection = [];
	this.retweetCnt = {};
};

Collection.prototype.add = function(tweet) {
	var entry = new Entry(tweet)
	this.collection.push(entry);
	this.incrementCnt(entry.retweetId);
};

Collection.prototype.incrementCnt = function(id) {
	if (this.retweetCnt[id]) {
		this.retweetCnt[id] += 1;
	} else {
		this.retweetCnt[id] = 1;
	}
};

Collection.prototype.remove = function(n) {
	//remove stuff n minutes ago
	var removeTime = (new Date()).getTime() - n * 1000 * 60;
	
	var entryTime = this.collection[0].createdTime;
	
	for (;entryTime < removeTime;) {
		var entry = this.collection.shift();
		this.retweetCnt[entry.retweetId] -= 1;
		
		entryTime = this.collection[0].createdTime;
	}
}; 

module.exports = Collection;
