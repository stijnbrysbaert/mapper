const fs = require('fs');
var GeoJSON = require('geojson');
const constants = require('../constants');
const path = require('path');

const newEngine = require('@comunica/actor-init-sparql').newEngine;
const myEngine = newEngine();

let query = `
PREFIX 	rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX 	rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX  locn: <http://www.w3.org/ns/locn#>
PREFIX 	geo: <http://www.w3.org/2003/01/geo/wgs84_pos#>
PREFIX ext:  <https://stijnbrysbaert.github.io/OSLO-extension/vocabulary.ttl#>
PREFIX trips: <https://data.vlaanderen.be/ns/mobiliteit/trips-en-aanbod#>

SELECT ?label ?aantal ?lat ?long ?dienst {
	?s rdfs:label ?label .
  	?s trips:Transportobject.beschikbaarheid ?beschikbaarheid .
  	?beschikbaarheid ext:voertuigenBeschikbaar ?aantal .
  	?s locn:geometry ?loc .
  	?loc geo:lat ?lat .
    ?loc geo:long ?long .
    OPTIONAL { ?s ext:mobiliteitsdienst ?d .}
  	OPTIONAL { ?d rdfs:label ?dienst .}
}`;

module.exports = async () => {
    var data = [];
  var myFile = fs.createWriteStream('public/bluebike.geojson');
  const result = await myEngine.query(query, {
    sources: [constants.endpoint + "bluebike.ttl", constants.endpoint + "velo.ttl"],
  });
  const bindings = await result.bindings();
(bindings).forEach(station => {
    var entry = {   name: station.get('?label') ? station.get('?label').value : "unknown",
                    beschikbaar: station.get('?aantal') ? station.get('?aantal').value : "unknown",
                    'marker-symbol': 'bicycle',
                    dienst: station.get('?dienst') ? station.get('?dienst').value : "unknown",
                    lat: station.get('?lat').value, 
                    lng: station.get('?long').value }
    data.push(entry);
});
var geo = GeoJSON.parse(data, {Point: ['lat', 'lng']});
// myFile.write(JSON.stringify(geo), () => {
//   console.log("mapped to geojson %s", new Date());
// });
fs.writeFileSync('public/bluebike.geojson', JSON.stringify(geo));
console.log("mapped to geojson %s", new Date());
}