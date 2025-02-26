const express = require('express');
const Router = express.Router();
// Include pug library for generating and passing data to templates
const pug = require('pug');
// Utility functions
const { 
  addUser, getRooms,
  getRoom, addRoom,
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

  const newRoomID = addRoom({ 
    room_name,
    room_max_users: parseInt(room_max_users)
  });

  displayToConsole(`Creating new room: ${room_name}`);

  res.redirect(`/room/${newRoomID}`);
})
Router.get('/room/:roomID', (req,res) => {
  const { roomID } = req.params;

  const room = getRoom(roomID);

  let user = {
    username: 'test'
  }

  displayToConsole(`User "${user.username}" joining room: "${room.name}"`);

  res.end(ROOM_PAGE({
    user,
    room
  }));
})
// Redirect any other incorrect path traffic to the home page
Router.use('*', (req,res) => {
  res.redirect('/');
});

module.exports = Router;