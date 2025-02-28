/*
  Utility Funcitons export file
*/
// General utility functions
const {
  displayToConsole
} = require('./utils.js');
// Functions specific to user data
const { 
  addUser, getUser,
  addUserRoom, removeUserCurrentRoom
} = require('./users.js');
// Functions specific to room data
const {
  getRooms, getRoom, addRoom,
  incrementRoomUsers, decrementRoomUsers
} = require('./rooms.js');

module.exports = {
  addUser, getUser,
  addUserRoom, removeUserCurrentRoom,
  getRooms, getRoom, addRoom, 
  incrementRoomUsers, decrementRoomUsers,
  displayToConsole
}