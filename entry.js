function Entry(tweet) {
	this.text = tweet.retweeted_status.text;
	this.retweetId = tweet.retweeted_status.id;
	var d = new Date(Date.parse(tweet.created_at));
	this.createdTime = d.getTime();
};

module.exports = Entry;