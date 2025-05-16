/*
  Utility Funcitons export file
*/
// General utility functions
const {
  displayToConsole, resolveViewPath
} = require('./utils.js');
// Functions specific to user data
const { 
  addUser, getUser, getUserByUsername, addUserRoom,
  removeUserCurrentRoom, removeRoomFromUsersList
} = require('./users.js');
// Functions specific to room data
const {
  getRooms, getRoom, addRoom, removeRoom,
  incrementRoomUsers, decrementRoomUsers
} = require('./rooms.js');
// Functions for authentication
const {
  registerUser
} = require('./auth.js');

module.exports = {
  addUser, getUser, addUserRoom,
  removeUserCurrentRoom, removeRoomFromUsersList,
  getRooms, getRoom, addRoom, getUserByUsername, removeRoom,
  incrementRoomUsers, decrementRoomUsers,
  displayToConsole, resolveViewPath,
  registerUser
}