const https = require('https');
const constants = require('../../constants.js');
const fs = require('fs');
const keys = require('../../apikey');

var options = {
    headers: {
        apikey: keys.velokey
    }
}

https.get(constants.velo.get_entities, options, (res) => {
  
  var output = fs.createWriteStream(constants.velo.json);
  output.write('{ "velos": ')
  res.on('data', (d) => {
      output.write(d);
  });

  res.on('end', () => {
    output.write('}');
  });

}).on('error', (e) => {
  console.error(e);
});