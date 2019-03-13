const Common = require('../Utility/Common');
const Message = require('./Message');

class ChatRoom {

  constructor(name, userList) {
    this.id = Common.getRandomString();
    this.name = name;
    this.userList = userList;
    this.messageList = [];
    ChatRoom.ChatRoomList[this.id] = this;
  }
  addMessage(userId, message) {
    const messageT = new Message(userId, message, this.id);
    this.messageList.push(messageT);
    return messageT;
  }
  addUserToRoom(user) {
    this.userList.push(user);
  }
  deleteChatRoom() {
    delete ChatRoom.ChatRoomList[this.id];
  }

  static getChatRoomsByUserId(userId) {
    const listForThisUser = [];
    Object.keys(ChatRoom.ChatRoomList).forEach((room) => {
      if (room.userList.indexOf(userId) > -1) {
        listForThisUser.push(room);
      }
    });
    return listForThisUser;
  }
  static getChatRoomById(id) {
    return ChatRoom.ChatRoomList[id];
  }
}
module.exports = ChatRoom;
