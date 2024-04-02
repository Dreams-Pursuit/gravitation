"use strict";
const gameManager = require('../utils/gameManager.js');

const game = async (fastify, options, done) => {
  const { createUUID } = options;
  gameManager.startProcessing();
  function broadcast(message) {
    for (const client of fastify.websocketServer.clients) {
      client.send(JSON.stringify(message));
    }
  }

  fastify.get("/play", { websocket: true }, (connection, req) => {
    broadcast({ sender: "server", message: "new player connected" });
    connection.socket.on("close", () => {
      broadcast({ sender: "server", message: "player disconnected" });
    });

    connection.socket.on("message", (message) => {
      const data = JSON.parse(message);
      console.log(data);
      if(!data?.type)
      {
        connection.socket.send("Oops! Something's wrong with the message");
        return;
      }
      if (data.type === "join") {
        if(!data?.username)
        {
          connection.socket.send("Something went wrong!");
        }
        gameManager.gameQueue.joinQueue(data.username);
      }
      if (data.type === "move")
      {
        if(!data?.move || !data?.username)
        {
          connection.socket.send(JSON.stringify({message: "Invalid data format", isValidMove: false}));
          return;
        }
        const result = gameManager.makeTurn(data.username, data.move);
        if(result?.err)
        {
          connection.socket.send(JSON.stringify({message: "Invalid turn", isValidMove: false}));
          return;
        }
        connection.socket.send(JSON.stringify({message: "Valid turn", isValidMove: true}));
      }
    });
  });
  done();
};

module.exports = game;
