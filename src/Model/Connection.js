class Connection {
  constructor(socket, userId) {
    this.socket = socket;
    this.userId = userId;
    Connection.allConnections[userId] = socket;
    Connection.allSocketConnections[socket.id] = userId;
  }
  deleteConnection() {
    delete Connection.allConnections[this.userId];
  }
  static getConnectionByUserId(userId) {
    return Connection.allConnections[userId];
  }
}

Connection.allConnections = {};
Connection.allSocketConnections = {};
Connection.getAllActiveConnections = function () {
  const connections = [];
  Object.keys(Connection.allConnections).forEach((d) => {
    const temp = {};
    temp[d] = Connection.allConnections[d];
    connections.push(temp);
  });
  return connections;
};
module.exports = Connection;
