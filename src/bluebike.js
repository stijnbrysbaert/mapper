const fs = require('fs');
const N3 = require('n3');
const constants = require('../constants');
const bluebike = require('../queries/query_bluebike');
const toGeojson = require('./toGeojson');

const newEngine = require('@comunica/actor-init-sparql').newEngine;
const myEngine = newEngine();

async function RDFmapping(next, error){

  var myFile = fs.createWriteStream('./public/bluebike.ttl');
  // fs.chmodSync(constants.bluebike.ld, 0o777);
  const result = await myEngine.query(bluebike.query, {
    sources: [constants.bluebike.get_entities],
  });

  const writer = new N3.Writer({ end: false, prefixes: bluebike.prefixes});
  myFile.on('error', function (err) {
    console.log(err);
  });
  const quads = await result.quads();
  writer.addQuads(quads);
  writer.end((error, result) => {
    myFile.write(result);
  });

  console.log("mapped blue bikes %s", new Date());
  next();
}

exports.mapping = async () => {
  (new Promise(RDFmapping))
          .then(toGeojson)
          .catch((e) => {
                  console.error(e);
          });
}