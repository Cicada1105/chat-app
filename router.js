const express = require('express');
const Router = express.Router();
// Include pug library for generating and passing data to templates
const pug = require('pug');
// Utility functions
const { 
  addUser, addUserRoom,
  registerUser, generateUserToken,
  getUserByUsername, getUser,
  addRoom, getRooms, getRoom, 
  incrementRoomUsers,
  displayToConsole, resolveViewPath,
} = require('./utils');
// Middleware
const {
  authenticateUser, verifySession, clearCurrentRoom
} = require('./middleware.js');

const HOME_PAGE = pug.compileFile(resolveViewPath('home'));
const LOGIN_PAGE = pug.compileFile(resolveViewPath('login'));
const REGISTER_PAGE = pug.compileFile(resolveViewPath('register'));
const ROOMS_PAGE = pug.compileFile(resolveViewPath('rooms'));
const ROOM_PAGE = pug.compileFile(resolveViewPath('room'));

Router.get('/',(req,res) => {
  res.set('Content-Type','text/html');

  res.end(HOME_PAGE());
});
Router.get('/register', [verifySession], (req,res) => {
  res.set('Content-Type','text/html');

  res.end(REGISTER_PAGE({
    cspNonce: res.locals.cspNonce
  }));
});
Router.post('/register', [verifySession], (req,res) => {
  let { username, password } = req.body;

  let user = getUserByUsername(username);

  if ( user ) {
    res.set('Content-Type','text/html');

    res.end(REGISTER_PAGE({
      errorMsg: 'User already exists.'
    }));
  }
  else {
    // Hash password and store user
    let user = registerUser({ username, password })

    if ( user ) {
      displayToConsole(`New user created: "${user['id']}"`);
      // Create a session token 
      const token = generateUserToken({
        id: user['id']
      });
      res.cookie('uci',token);

      // Redirect to rooms page
      res.redirect('/rooms'); 
    }
    else {
      res.set('Content-Type','text/html');

      res.end(REGISTER_PAGE({
        errorMsg: 'Error registering user.'
      })); 
    }
  }
});
Router.get('/login', [verifySession], (req,res) => {
  res.set('Content-Type','text/html');

  res.end(LOGIN_PAGE());
});
Router.post('/login', [authenticateUser], (req,res) => {
  if ( req.isAuthenticated ) {
    const userID = req.id;
    const token = generateUserToken({ id: userID });
    // Set web token as cookie
    res.cookie('uci',token);

    displayToConsole(`User logging in: "${userID}"`);

    res.redirect('/rooms'); 
  }
  else {
    res.set('Content-Type','text/html');

    res.end(LOGIN_PAGE({
      errorMsg: 'Login is incorrect.'
    }));
  }
});
Router.get('/rooms', [verifySession, clearCurrentRoom], (req,res) => {
  const user = getUser(req.id)
  const rooms = getRooms();

  res.set('Content-Type','text/html');
  res.end(
    ROOMS_PAGE({
      user,
      rooms,
      cspNonce: res.locals.cspNonce
    })
  );
})
Router.post('/rooms', [verifySession], (req,res) => {
  let { room_name, room_max_users } = req.body;

  const userID = req.id;

  const newRoomID = addRoom({
    owner_id: userID,
    room_name,
    room_max_users: parseInt(room_max_users)
  });

  displayToConsole(`Room "${room_name}" created by "${userID}"`);

  res.redirect(`/room/${newRoomID}`);
});
Router.get('/room/:roomID(\\w+-\\w+-\\w+-\\w+-\\w+)', [verifySession], (req,res) => {
  const { roomID } = req.params;

  const userID = req.id;
  const user = getUser(userID);
  const room = getRoom(roomID);

  // Check if room exists
  if ( !room ) {
    res.redirect('/rooms');
  }
  else {
    // If user is already in the room (ie. refresh) no need to add user to room
    if ( user.currRoom === roomID ) {
      displayToConsole(`User "${userID}" re-joining room "${room['id']}"`);

      res.set('Content-Type','text/html');
      res.end(ROOM_PAGE({
        user,
        room,
        cspNonce: res.locals.cspNonce
      }));
    }
    // Increase total number of users in room if there is space available
    else if ( incrementRoomUsers(roomID) ) {
      // Add user to the room they are joining
      addUserRoom(userID, roomID);

      displayToConsole(`User "${userID}" joining room "${room['id']}"`);

      res.set('Content-Type','text/html');
      res.end(ROOM_PAGE({
        user,
        room,
        cspNonce: res.locals.cspNonce
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