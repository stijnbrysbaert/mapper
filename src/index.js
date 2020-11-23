const bluebike = require('./bluebike.js');
const velo = require('./velo');
const geojson = require('./toGeojson');
const constants = require('../constants');

module.exports = async function() {
    bluebike.mapping();
    // velo.mapping(constants.velo);
}