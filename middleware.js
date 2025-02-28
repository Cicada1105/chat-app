const { 
  getUser, removeUserCurrentRoom,
  decrementRoomUsers
} = require('./utils');

function userExists(req,res,next) {
  let cookies = req['headers']['cookie'];
  let cookieParts = cookies.split(';');
  let userID;

  for ( let cookie of cookieParts ) {
    let cleanCookie = cookie.trim();
    if ( cleanCookie.startsWith('uci') ) {
      userID = cleanCookie.split('=')[1];
      break;
    }
  }

  if ( userID ) {
    const user = getUser(userID);

    if ( !user ) {
      // If user is already at login page no need to redirect and cause infinit middleware check
      req.url === '/' ? next() : res.redirect('/');
    }
    else {
      req.user = user;
      next();
    }
  }
  else {
    // If user is already at login page no need to redirect and cause infinit middleware check
    req.url === '/' ? next() : res.redirect('/');
  }
}
/*
  This middleware removes the current user from the current room
  they are in when navigating elsewhere
*/
function clearCurrentRoom(req,res,next) {
  // Retrieve user from userExists middleware
  const user = req.user;

  // Remove current room if there is one to be removed
  if ( user.currRoom ) {
    // Remove user from current room
    removeUserCurrentRoom(user['id']);
    // Decrease number of users in the room
    decrementRoomUsers(user['currRoom']);
    // Update user data in the request object
    req.user = getUser(user['id']);
  }

  next();
}

module.exports = {
  userExists, clearCurrentRoom
}