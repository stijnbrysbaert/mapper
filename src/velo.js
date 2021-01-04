const yarrrml = require('@rmlio/yarrrml-parser/lib/rml-generator');
const RMLMapperWrapper = require('@rmlio/rmlmapper-java-wrapper');
const constants = require('../constants');
const fs = require('fs');
const path = require("path");
const N3 = require('n3');
const velo = require('../queries/query_velo');
const getVelos = require('./api/velo');
    
function yarrrmlParser (jsonVelo){
        return new Promise((resolve, reject) => {
                const y2r = new yarrrml();
                const file = fs.readFileSync(path.resolve(constants.velo.yarrrml), 'utf8');
                const triples = y2r.convert(file);
                var output = fs.createWriteStream(constants.velo.rml, {emitClose: true});
                const writer = new N3.Writer(output, {prefixes: velo.prefixes});
                writer.addQuads(triples);
                output.on('error', function (err) {
                        throw "error in yarrrml parser";
                });
                writer.end(() => {resolve(jsonVelo)});
                return;
        });
}

async function rmlMapper(jsonVelo){
        return new Promise(async (resolve, reject) => {
                const rmlmapperPath = './rmlmapper.jar';
                const tempFolderPath = './tmp';
        
                const wrapper = new RMLMapperWrapper(rmlmapperPath, tempFolderPath, true);
                const rml = fs.readFileSync(constants.velo.rml, 'utf-8');
                const sources = {
                'velo.json': JSON.stringify(jsonVelo)
                };
                const result = await wrapper.execute(rml, {sources, generateMetadata: false, serialization: 'turtle'});
                const file = fs.createWriteStream(constants.velo.ld);
                file.write(result.output);
                console.log("mapped velos %s", new Date());
        });
}

exports.mapping = async () => {
        (new Promise(getVelos))
                .then(yarrrmlParser, (e) => {console.error("hey", e)})
                .then(rmlMapper)
                .catch((e) => {
                        console.error(e);
                });
}