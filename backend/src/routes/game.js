"use strict";
const {winnerAlgo, advancedMode} = require("../utils/gameLogic.js");
const gameQueue = require("../utils/gameQueue.js");

const queue = new gameQueue();
      
const game = async (fastify, options, done) => {
  const { createUUID } = options;
  queue.startQueue();
  const games = queue.gamesMap;
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
      if(!data?.type || !data?.username){
        client.send({message: "Oops! Something's wrong with the message"});
        return;
      }
      if (data.type === "join") {
        if (games.has(data.username)) {
          client.send({message: "Can't connect one player to two games"});
          return;
        } else {
          queue.joinQueue(data.username);
        }
      }
      if (data.type === "move") {
        if(!games.has(data.username)){
          client.send({message: "This game does not exist", isValidMove: false});
          return;
        }
        if(!data?.move){
          client.send({message: "Seems like you forgot to make your turn", isValidMove: false});
          return;
        }
        const temp = games.get(data.username);
        if(data.username !== temp.players[temp.turn] || data.move[0] < 0 || data.move[0] >= 6 || data.move[1] < 0 || data.move[1] >= 6){
          client.send({message: "Wait, something's wrong with the turn", isValidMove: false});
          return;
        }
        temp.board[data.move[0]][data.move[1]] = temp.symbols[temp.turn];
        const winnerSymbol = winnerAlgo(temp.board).winner;
        advancedMode(temp.board, data.move[0], data.move[1]);
        if(winnerSymbol){
          const winner = temp.symbols.indexOf(winnerSymbol);
          // Here will be some query to write rhe result to database
          games.delete(temp.firstPlayer);
          games.delete(temp.secondPlayer);
          client.send({message: `Player ${winner} won!`, winner: winner});
          return;
        }
        temp.turn = (temp.turn) % 2;
        client.send({message:"The move has been successfully added",isValidMove: true});
        return;
      }
    });
  });
  done();
};

module.exports = game;
