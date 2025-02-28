const express = require('express');
const Router = express.Router();
// Include pug library for generating and passing data to templates
const pug = require('pug');
// Utility functions
const { 
  addUser, getRooms,
  getRoom, addRoom,
  displayToConsole
} = require('./utils');
// Middleware
const { userExists } = require('./middleware.js');

const LOGIN_PAGE = pug.compileFile('./views/login.pug');
const ROOMS_PAGE = pug.compileFile('./views/rooms.pug');
const ROOM_PAGE = pug.compileFile('./views/room.pug');

Router.get('/', [userExists], (req,res) => {
  res.end(LOGIN_PAGE());
});
Router.post('/login', [userExists], (req,res) => {
  let { username } = req.body;

  let newUserID = addUser(username);

  displayToConsole(`New user created: ${username}`);

  res.cookie('uci',newUserID);
  res.redirect('/rooms');
});
Router.get('/rooms', [userExists], (req,res) => {
  const rooms = getRooms();

  res.end(
    ROOMS_PAGE({
      rooms
    })
  );
})
Router.post('/rooms', [userExists], (req,res) => {
  let { room_name, room_max_users } = req.body;

  const newRoomID = addRoom({ 
    room_name,
    room_max_users: parseInt(room_max_users)
  });

  displayToConsole(`Creating new room: ${room_name}`);

  res.redirect(`/room/${newRoomID}`);
})
Router.get('/room/:roomID(\\w+-\\w+-\\w+-\\w+-\\w+)', [userExists], (req,res) => {
  const { roomID } = req.params;

  const user = req.user;
  const room = getRoom(roomID);

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