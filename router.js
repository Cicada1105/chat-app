const express = require('express');
const Router = express.Router();
// Include pug library for generating and passing data to templates
const pug = require('pug');
// Utility functions
const { 
  addUser, addUserRoom,
  getRooms, getRoom, 
  addRoom, incrementRoomUsers,
  displayToConsole
} = require('./utils');
// Middleware
const { userExists, clearCurrentRoom } = require('./middleware.js');

const LOGIN_PAGE = pug.compileFile('./views/login.pug');
const ROOMS_PAGE = pug.compileFile('./views/rooms.pug');
const ROOM_PAGE = pug.compileFile('./views/room.pug');

Router.get('/', [userExists], (req,res) => {
  res.end(LOGIN_PAGE());
});
Router.post('/login', (req,res) => {
  let { username } = req.body;

  let newUserID = addUser(username);

  displayToConsole(`New user created: "${username}"`);

  res.cookie('uci',newUserID);
  res.redirect('/rooms');
});
Router.get('/rooms', [userExists, clearCurrentRoom], (req,res) => {
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

  const user = req.user;

  displayToConsole(`Room "${room_name}" created by "${user['username']}"`);

  res.redirect(`/room/${newRoomID}`);
})
Router.get('/room/:roomID(\\w+-\\w+-\\w+-\\w+-\\w+)', [userExists], (req,res) => {
  const { roomID } = req.params;

  const user = req.user;
  const room = getRoom(roomID);

  // Check if room exists
  if ( !room ) {
    res.redirect('/rooms');
  }
  else {
    // If user is already in the room (ie. refresh) no need to add user to room
    if ( user.currRoom === roomID ) {
      res.end(ROOM_PAGE({
        user,
        room
      }));
      displayToConsole(`User "${user['username']}" re-joining room "${room['name']}"`);
    }
    // Increase total number of users in room if there is space available
    else if ( incrementRoomUsers(roomID) ) {
      // Add user to the room they are joining
      addUserRoom(user['id'], roomID);

      displayToConsole(`User "${user['username']}" joining room "${room['name']}"`);

      res.end(ROOM_PAGE({
        user,
        room
      }));
    }
    else {
      res.redirect('/rooms');
    }
  }
})
// Redirect any other incorrect path traffic to the home page
Router.use('*', (req,res) => {
  res.redirect('/');
});

module.exports = Router;