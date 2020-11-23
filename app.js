require('dotenv').config();
const express = require('express')
const cron = require('node-cron');
const mapper = require('./src/index');
const fs = require('fs');
const path = require('path');

const app = express()
const dir = "./public";

//run query every hour
cron.schedule('*/2 * * * *', function() {
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
  next();
});

var options = {
    index: './bluebike.ttl',
  }

app.use(express.static(path.join(__dirname, 'public'), options))

app.listen(process.env.PORT, () => {
  console.log(`Example app listening at http://localhost:${process.env.PORT}`)
})