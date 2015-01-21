var Entry = require('./entry.js');

Collection = function() {
	this.collection = [];
	this.retweetCnt = {};
	this.retweetText = {};
};

Collection.prototype.add = function(tweet) {
	var entry = new Entry(tweet)
	this.collection.push(entry);
	this.incrementCnt(entry.retweetId, entry.text);
};

Collection.prototype.incrementCnt = function(id, text) {
	if (this.retweetCnt[id]) {
		this.retweetCnt[id] += 1;
	} else {
		this.retweetCnt[id] = 1;
		this.retweetText[id] = text;
	}
};

Collection.prototype.remove = function(n) {
	//remove stuff n minutes ago
	var removeTime = (new Date()).getTime() - n * 1000 * 60;
	
	var entryTime = this.collection[0].createdTime;
	
	for (;entryTime < removeTime;) {
		var entry = this.collection.shift();
		this.retweetCnt[entry.retweetId] -= 1;
		if (this.retweetCnt[entry.retweetId] <= 0) {
			delete this.retweetText[entry.retweetId];
		}
	
		entryTime = this.collection[0].createdTime;
	}
}; 

Collection.prototype.topTen = function() {
	var sortable = [];
	
	for (var entryId in this.retweetCnt) {
		sortable.push([entryId, this.retweetCnt[entryId],this.retweetText[entryId]]);
	}
	
	sortable.sort(function(a, b) {return b[1] - a[1]})
	
	return sortable.slice(0, 10);
}

module.exports = Collection;
