"use strict";
const gameManager = require("../utils/gameManager.js");
const { validateToken } = require("../lib/token.js");

const game = async (fastify, options, done) => {
  const { createUUID } = options;
  gameManager.startProcessing();
  const SOCKETS = {};
  function notifyPlayers(message, ids) {
    ids.forEach((playerID) => {
      SOCKETS[playerID].send(JSON.stringify(message));
    });
  }

  fastify.get("/play", { websocket: true }, (connection, req) => {
    // if (
    //   !req.headers?.authorization ||
    //   !req.headers?.username ||
    //   validateToken(req.headers.authorization, req.headers.username) <= 0
    // ) {
    //   connection.socket.send(
    //     JSON.stringify({ sender: "server", message: "Invalid token" }),
    //   );
    //   connection.socket.close();
    //   return;
    // }
    SOCKETS[req.headers.username] = connection.socket;
    SOCKETS[req.headers.username].on("close", () => {
      delete SOCKETS[req.headers.username];
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
        gameManager.gameQueue.queueEvents.emit(
          "joinGame",
          req.headers.username,
        );
      }
      if (data.type === "move") {
        console.log(req.headers.username);
        if (!data?.move) {
          SOCKETS[req.headers.username].send(
            JSON.stringify({
              message: "Invalid data format",
              isValidMove: false,
            }),
          );
          return;
        }
        const result = gameManager.makeTurn(req.headers.username, data.move);
        if (result?.err) {
          SOCKETS[req.headers.username].send(
            JSON.stringify({
              message: "Invalid turn",
              isValidMove: false,
              error: result.err,
            }),
          );
          return;
        }
        const playerNames = gameManager.gameMap.get(
          req.headers.username,
        ).players;
        notifyPlayers(
          {
            turn: {
              col: data.move.col,
              row: data.move.row,
            },
            isValid: true,
          },
          playerNames,
        );
        return;
      }
    });
  });
};

module.exports = game;
