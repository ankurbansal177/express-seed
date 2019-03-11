const Common = require('../Utility/Common');

class User {
  constructor(name) {
    this.id = Common.getRandomString();
    this.active = true;
    this.firstName = name;
    User.UserMap[this.id] = this;
  }

  setUserDetails(user) {
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.country = user.country;
    this.alpha2Code = user.alpha2Code;
    this.phoneNumber = user.phoneNumber;
  }
  static getUserDetailsById(id) {
    return User.UserMap[id];
  }
  static getAllActiveUsers() {
    const users = [];
    Object.keys(User.UserMap).forEach((d) => {
      const temp = User.UserMap[d];
      users.push(temp);
    });
    return users;
  }
  static getName(id) {
    const user = User.getUserDetailsById(id);
    return (user.firstName + user.lastName);
  }

}
User.UserMap = {};
module.exports = User;
