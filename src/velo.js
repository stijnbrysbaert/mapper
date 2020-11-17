const yarrrml = require('@rmlio/yarrrml-parser/lib/rml-generator');
const RMLMapperWrapper = require('@rmlio/rmlmapper-java-wrapper');
const constants = require('../constants');
const fs = require('fs');
const path = require("path");
const N3 = require('n3');
const velo = require('../queries/query_velo');
    
function yarrrmlParser (operator, next){
        console.log("start parser");
        const y2r = new yarrrml();
        const file = fs.readFileSync(path.resolve(operator.yarrrml), 'utf8');
        const triples = y2r.convert(file);
        var output = fs.createWriteStream(operator.rml, {emitClose: true});
        const writer = new N3.Writer(output, {prefixes: velo.prefixes});
        writer.addQuads(triples);
        output.on('error', function (err) {
                console.log(err);
        });
        writer.end(() => {next(operator)});
}

async function rmlMapper(operator){
        const rmlmapperPath = './rmlmapper.jar';
        const tempFolderPath = './tmp';

        const wrapper = new RMLMapperWrapper(rmlmapperPath, tempFolderPath, true);
        const rml = fs.readFileSync(operator.rml, 'utf-8');
        const sources = {
        'velo.json': fs.readFileSync(operator.json, 'utf-8')
        };
        const result = await wrapper.execute(rml, {sources, generateMetadata: false, serialization: 'turtle'});
        const file = fs.createWriteStream(constants.velo.ld);
        file.write(result.output);
        console.log("mapped velos %s", new Date());
}

exports.mapping = async (operator) => {
        yarrrmlParser(operator, rmlMapper);
}