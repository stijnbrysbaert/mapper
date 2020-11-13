const fs = require('fs');
var GeoJSON = require('geojson');

const newEngine = require('@comunica/actor-init-sparql').newEngine;
const myEngine = newEngine();

let query = `
PREFIX 	rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX 	rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX  locn: <http://www.w3.org/ns/locn#>
PREFIX 	geo: <http://www.w3.org/2003/01/geo/wgs84_pos#>
PREFIX ext:  <https://stijnbrysbaert.github.io/OSLO-extension/vocabulary.ttl#>
PREFIX trips: <https://data.vlaanderen.be/ns/mobiliteit/trips-en-aanbod#>

SELECT ?label ?aantal ?lat ?long {
	?s rdfs:label ?label .
  	?s trips:Transportobject.beschikbaarheid ?beschikbaarheid .
  	?beschikbaarheid ext:voertuigenBeschikbaar ?aantal .
  	?s locn:geometry ?loc .
  	?loc geo:lat ?lat .
  	?loc geo:long ?long .
}`;

exports.toGeojson = async () => {
    var data = [];
  var myFile = fs.createWriteStream("./public/bluebike.geojson");
  fs.chmodSync("./public/output.ttl", 0o777);
  const result = await myEngine.query(query, {
    sources: ["https://bluebike-mapper.azurewebsites.net/"],
  });
  const bindings = await result.bindings();
console.log(bindings.length);
(bindings).forEach(station => {
    var entry = {   name: station.get('?label').value,
                    beschikbaar: station.get('?aantal').value,
                    'marker-symbol': 'bicycle',
                    lat: station.get('?lat').value, 
                    lng: station.get('?long').value }
    data.push(entry);
});
var geo = GeoJSON.parse(data, {Point: ['lat', 'lng']});
myFile.write(JSON.stringify(geo));
console.log("mapped to geojson %s", new Date());
}