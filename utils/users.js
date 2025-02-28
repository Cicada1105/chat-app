/*
  Users Utility Functions
*/
// Global dependencies
//    Include FileSystem library for reading and writing to files
const fs = require('fs');
//    Include crypto library for generating uuids
const crypto = require('crypto');

function addUser(username) {
  let buffer = fs.readFileSync('./data.json');
  let dataString = buffer.toString();
  let data = JSON.parse(dataString);

  let newUser = {
    id: crypto.randomUUID(),
    username,
    currRoom: '',
    rooms: []
  }

  data['users'].push(newUser);

  fs.writeFileSync('./data.json', JSON.stringify(data));

  return newUser['id'];
}
function getUser(id) {
  let buffer = fs.readFileSync('./data.json');
  let dataString = buffer.toString();
  let data = JSON.parse(dataString);
  let result = data['users'].find(user => user['id'] === id);

  return result;
}

module.exports = {
  addUser, getUser
}