/*
  Users Utility Functions
*/
// Global dependencies
//    Include crypto library for generating uuids
const crypto = require('crypto');
// Local dependencies
const { _getFileData, _setFileData } = require('./utils');

function addUser(username) {
  let data = _getFileData();

  let newUser = {
    id: crypto.randomUUID(),
    username,
    currRoom: '',
    rooms: []
  }

  data['users'].push(newUser);

  _setFileData(data);

  return newUser['id'];
}
function getUser(id) {
  let data = _getFileData();
  let result = data['users'].find(user => user['id'] === id);

  return result;
}
function addUserRoom(userID, roomID) {
  let data = _getFileData();

  let index = data['users'].findIndex(user => user['id'] === userID);

  if ( index > -1 ) {
    let currUser = data['users'][index];

    // Only add room to user's rooms if they are not already a part of it
    !currUser['rooms'].includes(roomID) && currUser['rooms'].push(roomID);
    currUser['currRoom'] = roomID;

    // Update data with new user info
    data['users'][index] = currUser;

    _setFileData(data);
  }
}
function removeUserCurrentRoom(userID) {
  let data = _getFileData();

  let index = data['users'].findIndex(user => user['id'] === userID);

  if ( index > -1 ) {
    let currUser = data['users'][index];
    
    // Only remove room if there is one to be removed
    if ( currUser.currRoom ) {
      currUser['currRoom'] = '';

      // Update data with new user info
      data['users'][index] = currUser;

      _setFileData(data);
    }
  }
}

module.exports = {
  addUser, getUser,
  addUserRoom, removeUserCurrentRoom
}