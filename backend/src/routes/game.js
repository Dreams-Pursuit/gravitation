"use strict";
const gameManager = require("../utils/gameManager.js");
const { validateToken } = require("../lib/token.js");

const game = async (fastify, options, done) => {
  const { createUUID } = options;
  gameManager.startProcessing();
  const SOCKETS = {};
  function notifyPlayers(message, ids) {
    ids.forEach((playerID) => {
      if (!SOCKETS.hasOwnProperty(playerID)) {
        console.log("Player with this ID is not connected to the server");
        return;
      }
      SOCKETS[playerID].send(message);
    });
  }
  function broadcast(message) {
    for (const client of fastify.websocketServer.clients) {
      client.send(JSON.stringify(message));
    }
  }

  fastify.get("/play", { websocket: true }, (connection, req) => {
    if (
      !req.headers?.authorization ||
      !req.headers?.username ||
      validateToken(req.headers.authorization, req.headers.username) <= 0
    ) {
      connection.socket.send(
        JSON.stringify({ sender: "server", message: "Invalid token" }),
      );
      connection.socket.close();
      return;
    }
    SOCKETS[req.headers.username] = connection.socket;
    console.log(SOCKETS);
    SOCKETS[req.headers.username].on("close", () => {
      delete SOCKETS[req.headers.username];
      console.log(SOCKETS);
      broadcast({ sender: "server", message: "player disconnected" });
    });

    SOCKETS[req.headers.username].on("message", (message) => {
      const data = JSON.parse(message);
      if (!data?.type) {
        SOCKETS[req.headers.username].send(
          "Oops! Something's wrong with the message",
        );
        return;
      }
      if (data.type === "join") {
        if (!data?.username) {
          SOCKETS[req.headers.username].send("Something went wrong!");
        }
        gameManager.gameQueue.queueEvents.emit("joinGame", data.username);
      }
      if (data.type === "move") {
        if (!data?.move || !data?.username) {
          SOCKETS[req.headers.username].send(
            JSON.stringify({
              message: "Invalid data format",
              isValidMove: false,
            }),
          );
          return;
        }
        const result = gameManager.makeTurn(data.username, data.move);
        if (result?.err) {
          SOCKETS[req.headers.username].send(
            JSON.stringify({ message: "Invalid turn", isValidMove: false }),
          );
          return;
        }
        const players = gameManager.gameMap.get(req.headers.username).players;
        notifyPlayers(
          {
            turn: {
              col: data.move.col,
              row: data.move.row,
            },
            isValid: true,
          },
          players,
        );
        return;
      }
    });
  });
};

module.exports = game;
