const express = require('express')
const cron = require('node-cron');
const mapper = require('./src/index');

const app = express()
const port = 8080

//run query every hour
cron.schedule('*/10 * * * *', function() {
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