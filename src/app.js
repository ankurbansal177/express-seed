const express = require('express');

const appExpress = express();
const bodyParser = require('body-parser');
const app = require('http').createServer(appExpress);
const io = require('socket.io')(app);
const User = require('./Model/User');
const Connection = require('./Model/Connection');
const ChatRoom = require('./Model/ChatRoom');
const Common = require('./Utility/Common');

app.listen(3000);
appExpress.use(bodyParser.json());

io.on('connection', (socket) => {
  console.log("New Socket Id created", socket.id);
  updateUserListToSocket(socket);
  socket.on('authenticateUser', (userName, callback) => {
    console.log('Attempted connection', userName);
    const user = new User(userName);
    const connection = new Connection(socket, user.id);
    callback(user.id);
    updateUserListEveryWhere(socket);
  });

  socket.on('joinChatRoom', (room, fn) => {
    if (room && room.id) {
      ChatRoom.getChatRoomById(room.id).addUserToRoom(room.userId);
    } else if (room && room.userId && room.targetUserId) {
      const chatroom = new ChatRoom('room', [User.getUserDetailsById(room.userId), User.getUserDetailsById(room.targetUserId)]);
      fn(chatroom);
      broadCastToChatRoomUsers(chatroom, socket, room.userId);
    }
  });
  socket.on('messageSent', (message, fn) => {
    if (!message.chatRoomId) {
      return;
    }
    const chatRoom = ChatRoom.getChatRoomById(message.chatRoomId);
    if (!chatRoom) {
      return;
    }
    const messageSent = chatRoom.addMessage(message.userId, message.content);
    fn(messageSent);
    chatRoom.userList.forEach((user) => {
      if (user.id !== message.userId) {
        const idToBroadcast = Connection.getConnectionByUserId(user.id).id;
        socket.broadcast.to(idToBroadcast).emit('messageRecieved', messageSent);
      }
    });

  });

  socket.on('disconnect', () => {
    console.log('Got disconnect!');
    try {
      User.getUserDetailsById(Connection.allSocketConnections[socket.id]).active = false;
    } catch (e) {
      console.log(e);
    }
    updateUserListEveryWhere(socket);
  });
});
function broadCastToChatRoomUsers(chatRoom, socket, userId) {
  chatRoom.userList.forEach((user) => {
    if (userId !== user.id) {
      const idToBroadcast = Connection.getConnectionByUserId(user.id).id;
      socket.broadcast.to(idToBroadcast).emit('chatRoomJoined', chatRoom);
    }
  });
}

function updateUserListEveryWhere(socket) {
  socket.broadcast.emit('userListUpdated', User.getAllActiveUsers());
}
function updateUserListToSocket(socket) {
  socket.emit('userListUpdated', User.getAllActiveUsers());
}

