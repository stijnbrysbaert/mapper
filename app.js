const express = require('express')
const cron = require('node-cron');
const mapper = require('./src/index');
const fs = require('fs');

const app = express()
const port = 8080
const dir = "./public";

//run query every hour
cron.schedule('*/5 * * * *', function() {
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
    extensions: ['ttl'],
    index: 'output.ttl',
  }

app.use(express.static('public', options))

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})