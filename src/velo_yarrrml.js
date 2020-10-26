let yarrrml = require('@rmlio/yarrrml-parser/lib/rml-generator');
const fs = require('fs');
const path = require("path");
const N3 = require('n3');
const outputFile = "./public/velo.rml.ttl";

let prefixes = {
    map: 'http://mapping.example.com/',
    rr: 'http://www.w3.org/ns/r2rml#',
    rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
    rdfs: 'http://www.w3.org/2000/01/rdf-schema#',
    rml: 'http://semweb.mmlab.be/ns/rml#',
    ql: 'http://semweb.mmlab.be/ns/ql#'
};

const y2r = new yarrrml();
const file = fs.readFileSync(path.resolve(__dirname, './mapping.yml'), 'utf8');
const triples = y2r.convert(file);

var output = fs.createWriteStream(outputFile);
const writer = new N3.Writer(output, { end: false, prefixes: prefixes});
  output.on('error', function (err) {
    console.log(err);
  });
writer.addQuads(triples);
writer.end();