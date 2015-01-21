var Entry = require('./entry.js');

Collection = function() {
	this.collection = [];
	
	//store count and text using orig tweet id for fast retrieval
	this.retweetCnt = {};
	this.retweetText = {};
};

Collection.prototype.add = function(tweet) {
	var entry = new Entry(tweet)
	this.collection.push(entry);
	
	//store retweet count and text
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
	if (n === null) {
		return;
	}
	
	//remove entries n minutes ago
	var removeTime = (new Date()).getTime() - n * 1000 * 60;	
	var entryTime = this.collection[0].createdTime;
	
	//only need to check the earliest since array is chronological
	for (;entryTime < removeTime;) {
		var entry = this.collection.shift();
		this.removeEntry(entry);
		//set to the next entry time	
		entryTime = this.collection[0].createdTime;
	}
}; 

Collection.prototype.removeEntry = function(entry) {
	var id = entry.retweetId;
	this.retweetCnt[id] -= 1;
	if (this.retweetCnt[id] <= 0) {
		delete this.retweetText[id];
	}
}

//sort the retweets by the highest count then list top ten
Collection.prototype.topTen = function() {
	var sortable = [];
	
	for (var entryId in this.retweetCnt) {
		sortable.push([entryId, this.retweetCnt[entryId],this.retweetText[entryId]]);
	}
	
	sortable.sort(function(a, b) {return b[1] - a[1]})
	
	return sortable.slice(0, 10);
}

module.exports = Collection;
