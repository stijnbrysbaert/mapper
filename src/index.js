const bluebike = require('./bluebike.js');
const velo = require('./velo');
const constants = require('../constants');
const fs = require('fs');

module.exports = async function() {
    var dir = "./public";
    try{
        fs.rmdirSync(dir, {recursive: true});
        console.log(dir, " deleted");
        fs.mkdirSync(dir);
        console.log(dir, " created");
    }catch(err){
        console.error(`Error while deleting ${dir}.`);
    }
    bluebike.mapping();
    velo.mapping(constants.velo);
}