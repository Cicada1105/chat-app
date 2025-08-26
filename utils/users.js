/*
  Users Utility Functions
*/
// Global dependencies
//    Include crypto library for generating uuids
const crypto = require('crypto');
// Local dependencies
const { _getFileData, _setFileData } = require('./utils');

function addUser({ username, password, salt }) {
  let data = _getFileData();

  let newUser = {
    id: crypto.randomUUID(),
    username,
    password,
    salt,
    currRoom: '',
    rooms: []
  }

  data['users'].push(newUser);

  _setFileData(data);

  return newUser;
}
function getUser(id) {
  let data = _getFileData();
  let result = data['users'].find(user => user['id'] === id);

  return result;
}
function getUserByUsername(username) {
  let data = _getFileData();
  let result = data['users'].find(user => user['username'] === username);

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
function removeRoomFromUsersList(roomID) {
  let data = _getFileData();
  let users = data['users'];

  users.forEach((user,userIndex) => {
    let index = user['rooms'].findIndex(currRoomID => currRoomID === roomID);

    if ( index > -1 ) {
      data['users'][userIndex]['rooms'].splice(index, index + 1);
    }
  });

  _setFileData(data);
}

module.exports = {
  addUser, getUser, getUserByUsername, addUserRoom, 
  removeUserCurrentRoom, removeRoomFromUsersList
}