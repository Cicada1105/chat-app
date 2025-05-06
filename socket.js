const { getUser, displayToConsole } = require('./utils');

function initSocketConnection(io) {
  io.of('/chat').on('connection', (socket) => {
    const { userID, roomID } = socket['handshake'].query;

    // Join the current socket to the room
    socket.join(roomID);

    // Retrieve current user info
    const currentUser = getUser(userID);

    displayToConsole(`User "${currentUser.username}" connected`);

    // Notify users within the room that current user is joining
    socket.to(roomID).emit('userConnected', {
      username: currentUser['username']
    });

    socket.on('isTyping',(data) => {
      socket.to(roomID).emit('userTyping',{
        id: currentUser['id'],
        username: currentUser['username']
      });
    });
    socket.on('isNotTyping',(data) => {
      socket.to(roomID).emit('userNotTyping',{
        id: currentUser['id']
      });
    });
    socket.on('message',(data) => {
      let { message } = data;
      socket.to(roomID).emit('newMessage',{ 
        message: currentUser['username'].concat(': ',message)
      });
    })
    socket.on('disconnect',() => {
      displayToConsole(`User "${currentUser.username}" disconnected`);
      
      socket.to(roomID).emit('userDisconnected', {
        username: currentUser['username']
      });
    })
  });
}

module.exports = { initSocketConnection }