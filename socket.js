const {
  getUser, getRoom,
  removeRoom, displayToConsole
} = require('./utils');

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
  io.of('/rooms').on('connection',(socket) => {
    socket.on('closeRoom',(data) => {
      let { userID, roomID } = data;
      // Check if user is actually the owner of the room
      const room = getRoom(roomID);

      if ( room['owner_id'] === userID ) {
        const user = getUser(userID);
        displayToConsole(`User "${user.username}" closing room "${room.name}"`);
        // Disconnect all users in the corresponding room
        io.of('/chat').disconnectSockets(roomID);
        // Remove room
        removeRoom(roomID);
      }
    });
  })
}

module.exports = { initSocketConnection }