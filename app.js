require('dotenv').config();
const express = require('express')
const cron = require('node-cron');
const mapper = require('./src/index');
const fs = require('fs');
const path = require('path');

const app = express()
const dir = "./public";

cron.schedule('*/10 * * * *', function() {
  if(!fs.existsSync(dir)){
    try{
      fs.mkdirSync(dir);
    }catch(err){
      console.error("Error while creating folder %s", dir);
    }
  }
  mapper();
});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  // res.header('Link', '<https://stijnbrysbaert.github.io/OSLO-extension/example_data/donkey_context.json>; rel="http://www.w3.org/ns/json-ld#context"; type="application/ld+json"');
  next();
});

var options = {
    index: './bluebike.ttl',
  }

var velo_options = {
  setHeaders: function(res, path, stat){
    res.set('Link', '<https://json-ld.org/contexts/person.jsonld>; rel="http://www.w3.org/ns/json-ld#context"; type="application/ld+json"');
  }
}

app.use(express.static(path.join(__dirname, 'public'), options))
// app.use(express.static(path.join(__dirname, 'public/velo.json')))

app.listen(process.env.PORT, () => {
  console.log(`Example app listening at http://localhost:${process.env.PORT}`)
})