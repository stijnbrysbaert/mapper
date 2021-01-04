const fs = require('fs');
const N3 = require('n3');
const constants = require('../constants');
const bluebike = require('../queries/query_bluebike');
const toGeojson = require('./toGeojson');
const path = require('path');

const newEngine = require('@comunica/actor-init-sparql').newEngine;
const myEngine = newEngine();

async function RDFmapping(next, error){

  const result = await myEngine.query(bluebike.query, {
    sources: [constants.bluebike.get_entities],
  });

  const writer = new N3.Writer({ end: false, prefixes: bluebike.prefixes});
  const quads = await result.quads();
  writer.addQuads(quads);
  writer.end((error, result) => {
    fs.writeFileSync('public/bluebike.ttl', result);
    console.log("mapped blue bikes %s", new Date());
  });

  next();
}

exports.mapping = async () => {
  (new Promise(RDFmapping))
          .then(toGeojson)
          .catch((e) => {
                  console.error(e);
          });
}