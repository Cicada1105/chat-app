function initSocketConnection(io) {
  io.of('/chat').on('connection', (socket) => {
    socket.on('message',(data) => {
      let { message } = data;
      socket.broadcast.emit('newMessage',{ 
        message
      });
    })
    socket.on('disconnect',() => {
      socket.emit('userDisconnected');
    })
  });
}

module.exports = { initSocketConnection }