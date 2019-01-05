var utility = require('./utility.js');
var Twit = require('twit');
var crypto = require('crypto');
var https = require("https");
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var credentials = utility.getCredentials();
var quote = 'Hello';

//// TODO: Need to write a promise based getAoute Function!!

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
  var ret = ''
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
      var rawObject = data.substring(2, data.length-1)
      var jsonData = JSON.parse(rawObject);
      ret = jsonData.quoteText + "\n" + jsonData.quoteAuthor;
      quote = ret;
      tweet(quote + "\n" + createHash(currentdate));
      return ret;
    });
    }).on("error", (err) => {
      console.log("Error: " + err.message);
    });
  } catch (e) {
    console.log("Error while getting qoute\n*****\n" + e + "\n\n");
  }
  return ret;
}

function get(url) {
  // Return a new promise.
  return new Promise(function(resolve, reject) {
    // Do the usual XHR stuff
    var req = new XMLHttpRequest();
    req.open('GET', url);

    req.onload = function() {
      // This is called even on 404 etc
      // so check the status
      if (req.status == 200) {
        // Resolve the promise with the response text
        resolve(req.response);
      }
      else {
        // Otherwise reject with the status text
        // which will hopefully be a meaningful error
        reject(Error(req.statusText));
      }
    };

    // Handle network errors
    req.onerror = function() {
      reject(Error("Network Error"));
    };

    // Make the request
    req.send();
  });
}

get('https://api.forismatic.com/api/1.0/?method=getQuote&format=jsonp&lang=en&jsonp=?').then(function(response) {
  console.log("Success!:\n", response);
}, function(error) {
  console.error("Failed!:\n", error);
});

setInterval(get, 1000 * 2);
