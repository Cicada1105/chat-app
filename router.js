const express = require('express');
const Router = express.Router();

Router.get('/',(req,res) => {
  res.end('<h1>Home login page</h1>');
});
Router.post('/login', (req,res) => {
  console.log('Attempting to login');
  res.redirect('/rooms');
});
Router.get('/rooms', (req,res) => {
  res.end('<h1>Room List</h1>');
})
Router.post('/rooms', (req,res) => {
  console.log('Creating new room');
  let id = 1;

  res.redirect(`/room/${id}`);
})
Router.get('/room/:roomID', (req,res) => {
  const { roomID } = req.params;

  res.end(`<h1>Room: ${roomID}`);
})
// Redirect any other incorrect path traffic to the home page
Router.use('*', (req,res) => {
  res.redirect('/');
});

module.exports = Router;