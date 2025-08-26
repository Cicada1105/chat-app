const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const fs = require('fs');

const { addUser } = require('./users.js');

function registerUser({ username, password }) {
  try {
    let salt = crypto.randomBytes(32).toString('hex');
    let iterations = 1000;
    let keylen = 32;
    let firstDerivedKey = crypto.pbkdf2Sync(password, salt, iterations, keylen, 'sha512');
    let hash = firstDerivedKey.toString('hex');

    // Hash the already hashed password with pepper
    let pepper = process.env.pepper;
    let secondDerivedKey = crypto.pbkdf2Sync(hash, pepper, iterations, keylen, 'sha512');
    let hashedPassword = secondDerivedKey.toString('hex');
    let user = addUser({
      username,
      password: hashedPassword,
      salt
    })
    
    return user;
  } catch(err) {
    console.log('Error registering user');
    console.log(err);
    return false;
  }
}

function generateUserToken(payload) {
  // Retrieve private key to securely sign user data
  const privateKey = fs.readFileSync('./private.key');

  // Sign user data with respective key
  const token = jwt.sign(payload, privateKey, { algorithm: 'RS256' });

  return token;
}
function verifyUserToken(token) {
  // Retrieve public key to securely verify user data
  const publicKey = fs.readFileSync('./public.pem');

  // Verify payload data with respective key
  try {
    const payload = jwt.verify(token, publicKey, { algorithm: 'RS256' });

    return payload;
  } catch(err) {
    console.log('Error verifying user:');
    console.log(err);
    return false;
  }
}

module.exports = {
  registerUser, generateUserToken, verifyUserToken
}