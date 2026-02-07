const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const http = require('http');
require('dotenv').config();

// Include path for setting relative paths
const path = require('path');
const { Server } = require("socket.io");
// Create new express app
const app = express();
const server = http.createServer(app);
const io = new Server(server);

const { initSocketConnection } = require('./socket.js');
// Initialize listening to socket
initSocketConnection(io);

// Retrieve site routes
const ROUTES = require('./router.js');

app.set('views',path.join(__dirname, 'views'));
app.set('view engine','pug');

// Middlware
app.use((req,res,next) => {
  res.locals.cspNonce = require('crypto').randomBytes(16).toString('base64');
  next();
})
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      scriptSrc: ["'self'", (req, res) => `'nonce-${res.locals.cspNonce}'`],
      scriptSrcAttr: ["'self'"],
      connectSrc: ["https://ka-f.fontawesome.com/releases/v6.7.2/css/","http://localhost:3000/socket.io/","ws://localhost:3000/socket.io/"]
    },
  }
}));
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());

app.use('/',ROUTES);

server.listen(3000, () => {
  console.log('listening on *:3000');
});