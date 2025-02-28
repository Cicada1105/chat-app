const { getUser } = require('./utils');

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

module.exports = {
  userExists
}