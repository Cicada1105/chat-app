const express = require('express');
const Router = express.Router();
// Include pug library for generating and passing data to templates
const pug = require('pug');
// Utility functions
const { 
  addUser, addUserRoom,
  registerUser, getUserByUsername,
  addRoom, getRooms, getRoom, 
  incrementRoomUsers,
  displayToConsole, resolveViewPath,
} = require('./utils');
// Middleware
const { userExists, clearCurrentRoom } = require('./middleware.js');

const HOME_PAGE = pug.compileFile(resolveViewPath('home'));
const LOGIN_PAGE = pug.compileFile(resolveViewPath('login'));
const REGISTER_PAGE = pug.compileFile(resolveViewPath('register'));
const ROOMS_PAGE = pug.compileFile(resolveViewPath('rooms'));
const ROOM_PAGE = pug.compileFile(resolveViewPath('room'));

Router.get('/',(req,res) => {
  res.end(HOME_PAGE());
});
Router.get('/login', [userExists], (req,res) => {
  res.end(LOGIN_PAGE());
});
Router.post('/login', (req,res) => {
  let { username } = req.body;

  // Check if user exists
  let user = getUserByUsername(username);

  if ( !user )
    res.end(LOGIN_PAGE({
      errorMsg: 'User does not exist.'
    }));
  else {
    displayToConsole(`User logging in: "${user['username']}"`);

    res.cookie('uci',user['id']);
    res.redirect('/rooms'); 
  }
});
Router.get('/rooms', [userExists, clearCurrentRoom], (req,res) => {
  const rooms = getRooms();

  const user = req.user;

  res.end(
    ROOMS_PAGE({
      user,
      rooms
    })
  );
})
Router.get('/register', [userExists], (req,res) => {
  res.end(REGISTER_PAGE());
});
Router.post('/register', [userExists], (req,res) => {
  let { username, password } = req.body;

  let user = getUserByUsername(username);

  if ( user ) {
    res.end(REGISTER_PAGE({
      errorMsg: 'User already exists.'
    }));
  }
  else {
    // Hash password and store user
    let newUserID = registerUser({ username, password })

    if ( newUserID ) {
      displayToConsole(`New user created: "${username}"`);
      res.cookie('uci',newUserID);
      // Redirect to rooms page
      res.redirect('/rooms'); 
    }
    else {
      res.end(REGISTER_PAGE({
        errorMsg: 'Error registering user.'
      })); 
    }
  }
});
Router.post('/rooms', [userExists], (req,res) => {
  let { room_name, room_max_users } = req.body;

  const user = req.user;

  const newRoomID = addRoom({
    owner_id: user['id'],
    room_name,
    room_max_users: parseInt(room_max_users)
  });

  displayToConsole(`Room "${room_name}" created by "${user['username']}"`);

  res.redirect(`/room/${newRoomID}`);
});
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
});
// Redirect any other incorrect path traffic to the home page
// Not properly catching as fallback
/*Router.use('*', (req,res) => {
  res.redirect('/');
});*/

module.exports = Router;