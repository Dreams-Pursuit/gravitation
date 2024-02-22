"use strict";

const game = async (fastify, _, done) => {

  function broadcast(message) {
    for (const client of fastify.websocketServer.clients) {
      client.send(JSON.stringify(message));
    }
  }

  const boards = new Map();
  fastify.get("/play", { websocket: true }, (connection, req) => {
    broadcast({ sender: "server", message: "new player connected" });
    connection.socket.on("close", () => {
      broadcast({ sender: "server", message: "player disconnected" });
    });

    connection.socket.on("message", (message) => {
      const data = JSON.parse(message);
      if (data.type === "join") {
        if (boards.has(data.board)) {
          boards.get(data.board).push(connection);
        } else {
          boards.set(data.board, [connection]);
        }
      }
      if (data.type === "move") {
        const board = boards.get(data.board);
        if (board) {
          for (const client of board) {
            if (client !== connection) {
              client.send(JSON.stringify(data));
            }
          }
        }
      }
    });
  });

  done();
};

module.exports = game;
