/*
  Rooms Utility Functions
*/
// Global dependencies
//    Include crypto library for generating uuids
const crypto = require('crypto');
// Local dependencies
const { _getFileData, _setFileData } = require('./utils');

function getRooms() {
  let data = _getFileData();

  return data['rooms'];
}
function getRoom(id){
  let data = _getFileData();
  let result = data['rooms'].find(room => room['id'] === id);

  return result;
}
function addRoom({ room_name, room_max_users }) {
  let data = _getFileData();

  let newRoom = {
    id: crypto.randomUUID(),
    name: room_name,
    num_users: 0,
    max_num_users: room_max_users,
  }

  data['rooms'].push(newRoom);

  _setFileData(data);

  return newRoom['id'];
}

module.exports = {
  getRooms, getRoom, addRoom
}