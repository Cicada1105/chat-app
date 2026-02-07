const socket = io('/rooms');
const btns = document.getElementsByClassName('delete-room-btn');

for ( let btn of btns ) {
  let dataset = btn.dataset;
  let { user, room } = dataset;

  btn.addEventListener('click',() => {
    closeRoom(user,room);
  })
}
function closeRoom(userID, roomID) {
  socket.emit('closeRoom',{
    userID,
    roomID
  });
  window.location.assign('/rooms');
}