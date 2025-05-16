const crypto = require('crypto');

const {
  addUser
} = require('./users.js');

function registerUser({ username, password }) {
  try {
    let salt = crypto.randomBytes(32).toString('hex');
    let iterations = 1000;
    let keylen = 32;
    let derivedKey = crypto.pbkdf2Sync(password, salt, iterations, keylen, 'sha512');
    let hash = derivedKey.toString('hex');
    let newUserID = addUser({
      username,
      password: hash,
      salt
    })
    
    return newUserID;
  } catch(err) {
    console.log(err);
    return false;
  }
}

module.exports = {
  registerUser
}