const bluebike = require('./bluebike.js');
const velo = require('./velo');
const constants = require('../constants');
const fs = require('fs');

module.exports = async function() {
    bluebike.mapping();
    velo.mapping(constants.velo);
}