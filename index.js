const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
// Include path for setting relative paths
const path = require('path');
// Create new express app
const app = express();
const server = http.createServer(app);

app.set('views',path.join(__dirname, 'views'));
app.set('view engine','pug');

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());

app.get('/',(req,res) => {
  res.end('<h1>Hello</h1>');
})

server.listen(3000, () => {
  console.log('listening on *:3000');
});