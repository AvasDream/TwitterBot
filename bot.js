var fs = require("fs");
var Twit = require('twit');

var credentials = '';
getCredentials();

var T = new Twit({
  consumer_key:         credentials.consumer_key,
  consumer_secret:      credentials.consumer_secret,
  access_token:         credentials.access_token,
  access_token_secret:  credentials.access_token_secret,
  timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
  strictSSL:            true,     // optional - requires SSL certificates to be valid.
})
var params = {
  q: 'fsociety since:2011-07-11',
  count: 10
}

T.get('search/tweets', params, searchTwitter);



function searchTwitter(err, data, response) {
  var tweets = data.statuses;
  for (var i = 0; i < tweets.length; i++) {
    console.log(tweets[i].text);
  }
};






function getCredentials(err) {
  try {
    var content = fs.readFileSync("credentials.json");
    credentials = JSON.parse(content);
  } catch (e) {
    console.log("Failure while reading credentials file");
  }
}
