const jwt = require('jsonwebtoken');
const fs = require('fs');
const crypto = require('crypto');

const { 
  verifyUserToken, removeUserCurrentRoom,
  decrementRoomUsers, getUserByUsername,
  getUser, signUserToken
} = require('./utils');

function authenticateUser(req,res,next) {
  const { username, password } = req.body;
  const user = getUserByUsername(username);

  if ( !user ) {
    req.isAuthenticated = false;
    return next();
  }

  try {
    let iterations = 1000;
    let keylen = 32;
    // Check if the user's entered password, when hashed with the existing password's salt,
    //  results in the same hash -> passwords match
    let derivedKey = crypto.pbkdf2Sync(password, user['salt'], iterations, keylen, 'sha512');
    let hash = derivedKey.toString('hex');

    // Hash the already hashed password with pepper
    let pepper = process.env.pepper;
    let secondDerivedKey = crypto.pbkdf2Sync(hash, pepper, iterations, keylen, 'sha512');
    let hashedPassword = secondDerivedKey.toString('hex');

    req.isAuthenticated = hashedPassword === user['password'];
    req.id = user['id']
  } catch(err) {
    console.log('Error verifying user:');
    console.log(err);
  } finally {
    next();
  }
}
function verifySession(req,res,next) {
  let cookies = req.headers['cookie'] || '';
  let cookieParts = cookies.split(';');
  let userSessionToken;

  for ( let cookie of cookieParts ) {
    let cleanCookie = cookie.trim();
    if ( cleanCookie.startsWith('uci') ) {
      userSessionToken = cleanCookie.split('=')[1];
      break;
    }
  }

  const isFormPage = req.url === '/' || req.url === '/login' || req.url === '/register';
  if ( userSessionToken ) {
    const payload = verifyUserToken(userSessionToken);
    const userID = payload.id;

    if ( !userID ) {
      // If user is already at login or register page no need to redirect and cause infinit middleware check
       isFormPage ? next() : res.redirect('/register');
    }
    else {
      req.id = userID;
      // If user is at the login or register page, redirect to the rooms page
      isFormPage ? res.redirect('/rooms') : next();
    }
  }
  else {
    // If user is already at login or register page no need to redirect and cause infinit middleware check
    isFormPage ? next() : res.redirect('/register');
  }
}
/*
  This middleware removes the current user from the current room
  they are in when navigating elsewhere
*/
function clearCurrentRoom(req,res,next) {
  // Retrieve user from verifySession middleware
  const userID = req.id;
  // Retrieve user's current room
  const user = getUser(userID);

  // Remove current room if there is one to be removed
  if ( user.currRoom ) {
    // Remove user from current room
    removeUserCurrentRoom(userID);
    // Decrease number of users in the room
    decrementRoomUsers(user['currRoom']);
  }

  next();
}

module.exports = {
  authenticateUser, clearCurrentRoom, verifySession,
}