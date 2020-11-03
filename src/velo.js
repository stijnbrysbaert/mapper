const RMLMapperWrapper = require('@rmlio/rmlmapper-java-wrapper');
const fs = require('fs');
const constants = require('../constants');
const yarrrmlparser = require('./velo_rml');

exports.mapping = async () => {
        // yarrrmlparser(constants.velo);
        //map rml to turtle
        const rmlmapperPath = './rmlmapper.jar';
        const tempFolderPath = './tmp';
        
        const wrapper = new RMLMapperWrapper(rmlmapperPath, tempFolderPath, true);
        const rml = fs.readFileSync(constants.velo.rml, 'utf-8');
        const sources = {
        'velo.json': fs.readFileSync(constants.velo.json, 'utf-8')
        };
        const result = await wrapper.execute(rml, {sources, generateMetadata: false, serialization: 'turtle'});
        const file = fs.createWriteStream(constants.velo.ld);
        file.write(result.output);
        console.log("mapped velos %s", new Date());
}