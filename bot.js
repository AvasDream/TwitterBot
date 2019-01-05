var utility = require('./utility.js');
var Twit = require('twit');
var crypto = require('crypto');
const fetch = require("node-fetch");
var credentials = utility.getCredentials();
var quote = 'Hello';

var T = new Twit({
  consumer_key:         credentials.consumer_key,
  consumer_secret:      credentials.consumer_secret,
  access_token:         credentials.access_token,
  access_token_secret:  credentials.access_token_secret,
  timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
  strictSSL:            true,     // optional - requires SSL certificates to be valid.
})

//Search Twitter by term
function search(term) {
  var params = {
    q: term,
    count: 100,
    result_type: "recent"
  }
  T.get('search/tweets', params, searchTwitter);
}

//Tweet content to twitter
function tweet(content) {
  params = {
    status: content
  }
  T.post('statuses/update', params, postTweet);
}

function postTweet(err, data, response) {
  if (err) {
    console.log("Failure while tweeting content");
  } else {
    console.log("\x1b[42mTweet was tweeted successfully\x1b[0m");
  }
}

function searchTwitter(err, data, response) {
  var tweets = data.statuses;
  for (var i = 0; i < tweets.length; i++) {
    console.log(tweets[i].text);
  }
};

function  createHash(value, algo) {
  try {
    if (!algo) {
      //console.log("Using default Algotrithm MD5 for hashing");
      algo = 'md5'
    }
    const hash = crypto.createHash(algo);
    hash.update(value);
    return hash.digest('hex');
  } catch (e) {
    console.log("Error while creating Hash:" + e);
  }
}

function getHashtags(quote) {
  var params = {
    id: 1
  }
  T.get('trends/place', params, function(err, data, response) {
    console.log(JSON.stringify(data, undefined, 2));
        console.log(data.trends.name[0]);
    //var trends = data.trends;
    //var josn = JSON.parse(trends);
    //console.log(trends);
  });
}
function setupTweetWithQuote() {
  let quote_url = 'https://api.forismatic.com/api/1.0/?method=getQuote&format=json&lang=en&jsonp=?'
  fetch(quote_url)
    .then(response => response.json())
    //.then(json => console.log(json))
    .then(json => {
      var quote = "\"" + json.quoteText + "\"\n" + json.quoteAuthor;
      console.log(quote);
      tweet(quote);
    })
    .catch(err => {
      console.error(err)
    });
}


setupTweetWithQuote()
setInterval(setupTweetWithQuote, 1000 * 60 * 15);
