const https = require('https');
const constants = require('../../constants.js');
const fs = require('fs');
const config = require('../../config');

var options = {
    headers: {
        apikey: process.env.VELO_KEY || config.VELO_KEY
    }
}

module.exports = function(resolve, reject){
  
  https.get(constants.velo.get_entities, options, (res) => {
    const { statusCode } = res;
    var rawData = '';
    let error;
    if(statusCode !== 200){
      error = new Error('Request failed.\n' + `Status code ${statusCode}`);
    }

    if(error){
      throw error;
    }

    res.on('data', (chunk) => {
        rawData+=chunk;
    });

    res.on('end', () => {
      try {
        const parsedData = {velos:[]}
        parsedData.velos = JSON.parse(rawData);
        resolve(parsedData);
        return;
      } catch (e) {
        reject(e.message);
        throw "error parsing data to json";
      }
    });

  }).on('error', (e) => {
    console.error(e);
  });

  return;
}
