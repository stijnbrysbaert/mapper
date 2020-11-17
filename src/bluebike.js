const fs = require('fs');
const N3 = require('n3');
const constants = require('../constants');
const bluebike = require('../queries/query_bluebike');

const newEngine = require('@comunica/actor-init-sparql').newEngine;
const myEngine = newEngine();

exports.mapping = async () => {
  var myFile = fs.createWriteStream(constants.bluebike.ld);
  fs.chmodSync(constants.bluebike.ld, 0o777);
  const result = await myEngine.query(bluebike.query, {
    sources: [constants.bluebike.get_entities],
  });

  const writer = new N3.Writer(myFile, { end: false, prefixes: bluebike.prefixes});
  myFile.on('error', function (err) {
    console.log(err);
  });
  const quads = await result.quads();
  writer.addQuads(quads);
  writer.end();
  console.log("mapped blue bikes %s", new Date());
}