/*
  Rooms Utility Functions
*/
// Global dependencies
//    Include FileSystem library for reading and writing to files
const fs = require('fs');
//    Include crypto library for generating uuids
const crypto = require('crypto');

function getRooms() {
  let buffer = fs.readFileSync('./data.json');
  let dataString = buffer.toString();
  let data = JSON.parse(dataString);

  return data['rooms'];
}
function getRoom(id){
  let buffer = fs.readFileSync('./data.json');
  let dataString = buffer.toString();
  let data = JSON.parse(dataString);
  let result = data['rooms'].find(room => room['id'] === id);

  return result;
}
function addRoom({ room_name, room_max_users }) {
  let buffer = fs.readFileSync('./data.json');
  let dataString = buffer.toString();
  let data = JSON.parse(dataString);

  let newRoom = {
    id: crypto.randomUUID(),
    name: room_name,
    num_users: 0,
    max_num_users: room_max_users,
  }

  data['rooms'].push(newRoom);

  fs.writeFileSync('./data.json', JSON.stringify(data));

  return newRoom['id'];
}

module.exports = {
  getRooms, getRoom, addRoom
}