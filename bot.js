var utility = require('./utility.js');
var Twit = require('twit');
var crypto = require('crypto');
var https = require("https");
var credentials = utility.getCredentials();
var qoute = '';


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


function randomQuote() {
  try {
    quote =  "Something went wrong while grabbing qoutes :("
    https.get('https://api.forismatic.com/api/1.0/?method=getQuote&format=jsonp&lang=en&jsonp=?', (resp) => {
    let data = '';
    // A chunk of data has been recieved.
    resp.on('data', (chunk) => {
      data += chunk;
    });
    // The whole response has been received. Print out the result.
    resp.on('end', () => {
      var stringData = JSON.stringify(data);
      console.log(stringData);
      var jsonData = JSON.parse(stringData);
      console.log(jsonData.quoteText);
      //var clean = cleanInput(stringData);
      //var jsonData  = JSON.stringify(clean.toString());
      //console.log("\x1b[42mReceived Quote:\n" + stringData + "\x1b[0m");
      var ret = jsonData.quoteText + "\n" + jsonData.quoteAuthor + "\n";
      quote = ret;
      console.log("\nQuote: \n" + quote + "\n");
    });
    }).on("error", (err) => {
      console.log("Error: " + err.message);
    });
  } catch (e) {
    console.log("Error while getting qoute\n*****\n" + e + "\n\n");
  }
}

function cleanInput(input) {
  var s = input
  s = s.replace(/\\n/g, "\\n")
       .replace(/\\'/g, "\\'")
       .replace(/\\"/g, '\\"')
       .replace(/\\&/g, "\\&")
       .replace(/\\r/g, "\\r")
       .replace(/\\t/g, "\\t")
       .replace(/\\b/g, "\\b")
       .replace(/\\f/g, "\\f");
   s = s.replace(/[\u0000-\u0019]+/g,"");
   return s;
}

function main() {
  var currentdate = new Date().toLocaleString();
  quote = randomQuote();
  console.log(quote);
  //tweet(quote + "\n" + createHash(currentdate))
}

main()
setInterval(main, 1000 * 2);
