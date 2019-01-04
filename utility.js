var fs = require("fs");

exports.getCredentials  =function(err) {
  try {
    var content = fs.readFileSync("credentials.json");
    credentials = JSON.parse(content);
    return credentials;
  } catch (e) {
    console.log("\x1b[41mFailure while reading credentials file\x1b[0m");
    console.log(e);
  }
}
