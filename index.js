const fs = require('fs');
const N3 = require('n3');

const newEngine = require('@comunica/actor-init-sparql').newEngine;

const myEngine = newEngine();

exports.cronjob = async () => {
  var myFile = fs.createWriteStream("./public/output.ttl");
  const result = await myEngine.query(`
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX foaf: <http://xmlns.com/foaf/0.1/>
    PREFIX mv:   <http://schema.mobivoc.org/>
    PREFIX geo:  <http://www.w3.org/2003/01/geo/wgs84_pos#>
    PREFIX locn:  <http://www.w3.org/ns/locn#> 
    PREFIX tn:    <https://data.vlaanderen.be/ns/transportnetwerk#>
    PREFIX ext:   <https://stijnbrysbaert.github.io/OSLO-extension/vocabulary.ttl#>
    PREFIX geonames: <http://www.geonames.org/ontology#>

    CONSTRUCT {
        ?s rdf:type mv:ParkingFacility, tn:Transportobject .
        ?s rdfs:label ?o .
        ?s ext:voertuigenBeschikbaar ?cap .
        ?s ext:totaalPlaatsen ?totCap .
        ?s geonames:nearby ?nearby .
        ?s locn:geometry [ rdf:type geo:Point ; geo:long ?long ; geo:lat ?lat ] .
      } WHERE {
        GRAPH ?g {
          ?s rdf:type <http://schema.org/ParkingFacility> .
          ?s foaf:name ?o .
          ?s geo:long ?long .
          ?s geo:lat ?lat .
          ?s mv:capacity ?cap .
          ?s mv:totalCapacity ?totCap .
          ?s geonames:nearby ?nearby .
        }
      }`, {
    sources: ["https://datapiloten.be/bluebike/availabilities.geojson"],
  });

  const writer = new N3.Writer(myFile, { end: false, prefixes:
    {
      rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
      rdfs: 'http://www.w3.org/2000/01/rdf-schema#',
      foaf: 'http://xmlns.com/foaf/0.1/',
      mv: 'http://schema.mobivoc.org/',
      geo: 'http://www.w3.org/2003/01/geo/wgs84_pos#',
      locn: 'http://www.w3.org/ns/locn#',
      tn: 'https://data.vlaanderen.be/ns/transportnetwerk#',
      ext: 'https://stijnbrysbaert.github.io/OSLO-extension/vocabulary.ttl#',
      geonames: 'http://www.geonames.org/ontology#',
      xsd:      'http://www.w3.org/2001/XMLSchema#'
    }
  });
  const quads = await result.quads();
  writer.addQuads(quads);
  writer.end();
  console.log("written at %s", new Date());
}