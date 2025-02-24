const express = require('express');
const Router = express.Router();
// Include pug library for generating and passing data to templates
const pug = require('pug');

const LOGIN_PAGE = pug.compileFile('./views/login.pug');
const ROOMS_PAGE = pug.compileFile('./views/rooms.pug');
const ROOM_PAGE = pug.compileFile('./views/room.pug');

Router.get('/',(req,res) => {
  res.end(LOGIN_PAGE());
});
Router.post('/login', (req,res) => {
  console.log('Attempting to login');
  res.redirect('/rooms');
});
Router.get('/rooms', (req,res) => {
  const rooms = [
    {
      id: 1,
      name: 'Room1',
      num_users: 1,
      max_num_users: 2
    },
    {
      id: 2,
      name: 'Room2',
      num_users: 4,
      max_num_users: 8
    }
  ];

  res.end(
    ROOMS_PAGE({
      rooms
    })
  );
})
Router.post('/rooms', (req,res) => {
  console.log('Creating new room');
  let id = 1;

  res.redirect(`/room/${id}`);
})
Router.get('/room/:roomID', (req,res) => {
  const { roomID } = req.params;

  let data = {
    username: 'John',
    roomname: 'Chatsphere'
  }

  res.end(ROOM_PAGE(data));
})
// Redirect any other incorrect path traffic to the home page
Router.use('*', (req,res) => {
  res.redirect('/');
});

module.exports = Router;