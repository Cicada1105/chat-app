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

module.exports = {
  addUser, getUser
}