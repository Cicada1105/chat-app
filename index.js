const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
// Include path for setting relative paths
const path = require('path');
// Create new express app
const app = express();
const server = http.createServer(app);
// Retrieve site routes
const ROUTES = require('./router.js');

app.set('views',path.join(__dirname, 'views'));
app.set('view engine','pug');

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());

app.use('/',ROUTES);

server.listen(3000, () => {
  console.log('listening on *:3000');
});