const fs = require('fs');
const N3 = require('n3');

const newEngine = require('@comunica/actor-init-sparql').newEngine;

const myEngine = newEngine();

exports.mapping = async () => {
  var myFile = fs.createWriteStream("./public/output.ttl");
  const result = await myEngine.query(`
    PREFIX adr:  <https://data.vlaanderen.be/ns/adres#>
    PREFIX dc:   <http://purl.org/dc/terms/>
    PREFIX dienst: <https://stijnbrysbaert.github.io/OSLO-extension/mobiliteitsdiensten.ttl#>
    PREFIX ext:  <https://stijnbrysbaert.github.io/OSLO-extension/vocabulary.ttl#>
    PREFIX foaf: <http://xmlns.com/foaf/0.1/>
    PREFIX geo:  <http://www.w3.org/2003/01/geo/wgs84_pos#>
    PREFIX geonames: <http://www.geonames.org/ontology#>
    PREFIX locn: <http://www.w3.org/ns/locn#> 
    PREFIX mv:   <http://schema.mobivoc.org/>
    PREFIX prov: <http://www.w3.org/ns/prov#>
    PREFIX rdf:  <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX tn:   <https://data.vlaanderen.be/ns/transportnetwerk#>
    PREFIX trips:<https://data.vlaanderen.be/ns/mobiliteit/trips-en-aanbod#>

    CONSTRUCT {
        ?s rdf:type mv:ParkingFacility, tn:Transportobject, adr:AdresseerbaarObject, dc:Location .
        ?s rdfs:label ?o .
        ?s geonames:nearby ?nearby .
        ?s ext:mobiliteitsdienst dienst:blue_bike .
        ?s trips:Transportobject.beschikbaarheid _:b .
        ?s locn:geometry _:g .
        _:b rdf:type trips:Beschikbaarheid ;
            ext:totaalPlaatsen ?totCap ;
            ext:voertuigenBeschikbaar ?cap ;
            prov:generatedAtTime ?time .
        _:g rdf:type geo:Point ;
            geo:long ?long ;
            geo:lat ?lat .
      } WHERE {
        ?g prov:generatedAtTime ?time .
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
      adr:  'https://data.vlaanderen.be/ns/adres#',
      dienst:'https://stijnbrysbaert.github.io/OSLO-extension/mobiliteitsdiensten.ttl#',
      dc:   'http://purl.org/dc/terms/',
      ext:  'https://stijnbrysbaert.github.io/OSLO-extension/vocabulary.ttl#',
      foaf: 'http://xmlns.com/foaf/0.1/',
      geo:  'http://www.w3.org/2003/01/geo/wgs84_pos#',
      geonames: 'http://www.geonames.org/ontology#',
      locn: 'http://www.w3.org/ns/locn#',
      mv:   'http://schema.mobivoc.org/',
      prov: 'http://www.w3.org/ns/prov#',
      rdf:  'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
      rdfs: 'http://www.w3.org/2000/01/rdf-schema#',
      tn:   'https://data.vlaanderen.be/ns/transportnetwerk#',
      trips:'https://data.vlaanderen.be/ns/mobiliteit/trips-en-aanbod#',
      xsd:  'http://www.w3.org/2001/XMLSchema#',
    }
  });
  myFile.on('error', function (err) {
    console.log(err);
  });
  const quads = await result.quads();
  writer.addQuads(quads);
  writer.end();
  console.log("mapped blue bikes %s", new Date());
}