class Common {
  static getRandomString() {
    return Math.random().toString(36).substring(7);
  }
  static convertMapToLists(map) {
    const arr = [];
    Object.keys(map).forEach((val) => {
      arr.push(map[val]);
    });
    return arr;
  }
}

module.exports = Common;
