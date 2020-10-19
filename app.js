const express = require('express')
const app = express()
const port = 8080

var options = {
    extensions: ['ttl'],
    index: 'output.ttl',
  }

app.use(express.static('public', options))

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})