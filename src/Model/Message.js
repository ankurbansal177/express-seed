const Common = require('../Utility/Common');
const User = require('./User');
class Message {
  constructor(userId, content, chatRoomId) {
    this.id = Common.getRandomString();
    this.content = content;
    this.userId = userId;
    this.userName = User.getName(this.userId);
    this.time = (new Date()).getTime();
    this.chatRoomId = chatRoomId;
  }
}

module.exports = Message;
