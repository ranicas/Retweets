function Entry(tweet) {
	this.text = tweet.retweeted_status.text; //use original text instead of RT
	this.retweetId = tweet.retweeted_status.id;
	var d = new Date(Date.parse(tweet.created_at));
	this.createdTime = d.getTime();
};

module.exports = Entry;