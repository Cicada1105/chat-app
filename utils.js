/*
  Utility funcitons
*/
// Global dependencies
//    Include FileSystem library for reading and writing to files
const fs = require('fs');
//    Include crypto library for generating uuids
const crypto = require('crypto');

function displayToConsole(msg) {
  const DATE_OF_MESSAGE = new Date().toISOString();
  const DATE_OF_MESSAGE_LEN = DATE_OF_MESSAGE.length;
  const MESSAGE_LEN = msg.length;
  const MAX_WIDTH = Math.max(MESSAGE_LEN, DATE_OF_MESSAGE_LEN);
  const PADDING = 3;
  const DIVIDER = '-'.repeat(MAX_WIDTH + (PADDING * 2));

  let msgWithPadding
  let dateWithPadding;

  if ( MESSAGE_LEN > DATE_OF_MESSAGE_LEN ) {
    msgWithPadding = ' '.repeat(PADDING) + msg + ' '.repeat(PADDING);
    let charactersToPad = msgWithPadding.length - DATE_OF_MESSAGE_LEN;
    let padding = Math.floor(charactersToPad / 2);
    dateWithPadding = ' '.repeat(padding) + DATE_OF_MESSAGE;
  }
  else {
    dateWithPadding = ' '.repeat(PADDING) + DATE_OF_MESSAGE + ' '.repeat(PADDING);
    let charactersToPad = dateWithPadding.length - MESSAGE_LEN;
    let padding = Math.floor(charactersToPad / 2);
    msgWithPadding = ' '.repeat(padding) + msg;
  }

  console.log(DIVIDER);
  console.log('\x1b[95m' + dateWithPadding + '\x1b[0m');
  console.log('\x1b[95m' + msgWithPadding + '\x1b[0m');
  console.log(DIVIDER);
  console.log();
}

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
  addUser, getUser,
  getRooms, getRoom,
  addRoom, displayToConsole
}