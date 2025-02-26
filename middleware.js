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
      res.redirect('/');
    }
    else {
      req.user = user;
      next();
    }
  }
  else {
    res.redirect('/'); 
  }
}

module.exports = {
  userExists
}