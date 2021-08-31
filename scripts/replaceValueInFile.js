/**
 * Sets the app id within a cordova config.xml
 *
 * Takes the arguments: - <full path and name of filename> <old value> <new value>
 */
var fs = require('fs')

var filename = process.argv[2];
var oldValue = process.argv[3];
var newValue = process.argv[4];

var fs = require('fs')
fs.readFile(filename, 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }

  var result = replaceAll(data, oldValue, newValue);

  fs.writeFile(filename, result, 'utf8', function (err) {
    if (err){
      return console.log(err);
    }
  });
});

function replaceAll(content, search, replacement) {
  return content.split(search).join(replacement);
}
