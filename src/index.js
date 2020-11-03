const bluebike = require('./bluebike.js');
const velo = require('./velo');

module.exports = async function() {
    bluebike.mapping();
    velo.mapping();
}