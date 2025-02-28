/*
  Utility Funcitons export file
*/
// General utility functions
const {
  displayToConsole
} = require('./utils.js');
// Functions specific to user data
const { 
  addUser, getUser
} = require('./users.js');
// Functions specific to room data
const {
  getRooms, getRoom, addRoom
} = require('./rooms.js');

module.exports = {
  addUser, getUser,
  getRooms, getRoom,
  addRoom, displayToConsole
}