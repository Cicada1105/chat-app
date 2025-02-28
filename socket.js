const { displayToConsole } = require('./utils');

function initSocketConnection(io) {
  io.of('/chat').on('connection', (socket) => {
    displayToConsole('User connected');

    socket.on('message',(data) => {
      let { message } = data;
      socket.broadcast.emit('newMessage',{ 
        message
      });
    })
    socket.on('disconnect',() => {
      displayToConsole('User disconnect');
      
      socket.emit('userDisconnected');
    })
  });
}

module.exports = { initSocketConnection }