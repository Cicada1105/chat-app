const express = require('express');
const Router = express.Router();
// Include pug library for generating and passing data to templates
const pug = require('pug');
// Utility functions
const { 
  addUser, getRooms,
  displayToConsole
} = require('./utils.js');

const LOGIN_PAGE = pug.compileFile('./views/login.pug');
const ROOMS_PAGE = pug.compileFile('./views/rooms.pug');
const ROOM_PAGE = pug.compileFile('./views/room.pug');

Router.get('/',(req,res) => {
  res.end(LOGIN_PAGE());
});
Router.post('/login', (req,res) => {
  let { username } = req.body;

  addUser(username);

  displayToConsole(`New user created: ${username}`);

  res.redirect('/rooms');
});
Router.get('/rooms', (req,res) => {
  const rooms = getRooms();

  res.end(
    ROOMS_PAGE({
      rooms
    })
  );
})
Router.post('/rooms', (req,res) => {
  let { room_name, room_max_users } = req.body;

  displayToConsole(`Creating new room: ${room_name}`);

  let id = 1;

  res.redirect(`/room/${id}`);
})
Router.get('/room/:roomID', (req,res) => {
  const { roomID } = req.params;

  let data = {
    username: 'John',
    roomname: 'Chatsphere'
  }

  displayToConsole(`User "${data.username}" joining room: "${roomID}"`);

  res.end(ROOM_PAGE(data));
})
// Redirect any other incorrect path traffic to the home page
Router.use('*', (req,res) => {
  res.redirect('/');
});

module.exports = Router;