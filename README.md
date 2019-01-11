## Twitter bot

This twitter Bot uses the [forismatic](https://api.forismatic.com/api/1.0/?method=getQuote&format=json&lang=en&jsonp=?) API endpoint to get a random
quote and tweet it.
I used the [twit](https://github.com/ttezel/twit) package for communicating
with twitter. The API tokens need to be stored in a file called
`credentials.json` in this format:

```
{
  "consumer_key":         "X",
  "consumer_secret":     "X",
  "access_token":         "X",
  "access_token_secret":  "X"
}

```
