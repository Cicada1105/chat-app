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
function addRoom({ owner_id, room_name, room_max_users }) {
  let data = _getFileData();

  let newRoom = {
    id: crypto.randomUUID(),
    owner_id,
    name: room_name,
    num_users: 0,
    max_num_users: room_max_users,
  }

  data['rooms'].push(newRoom);

  _setFileData(data);

  return newRoom['id'];
}
function incrementRoomUsers(roomID) {
  let data = _getFileData();

  let roomIndex = data['rooms'].findIndex(room => room['id'] === roomID);

  if ( roomIndex > -1 ) {
    let currRoom = data['rooms'][roomIndex];
    // Only increment if there is still space in the room
    if ( (currRoom.num_users + 1) <= currRoom.max_num_users ) {
      data['rooms'][roomIndex].num_users += 1;
      _setFileData(data);
      // Successfully incremented number of users in the room
      return true;
    } 
  }

  return false;
}
function decrementRoomUsers(roomID) {
  let data = _getFileData();

  let roomIndex = data['rooms'].findIndex(room => room['id'] === roomID);

  if ( roomIndex > -1 ) {
    data['rooms'][roomIndex].num_users -= 1;

    _setFileData(data);
  }
}

module.exports = {
  getRooms, getRoom, addRoom,
  incrementRoomUsers, decrementRoomUsers
}