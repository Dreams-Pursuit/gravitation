"use strict";
const fastify = require("fastify");
const crypto = require("crypto");

//Routes
const game = require("./routes/game");

const build = (opts = {}) => {
  const app = fastify(opts);
  app.register(require("@fastify/websocket"));

  app.register(game, {
    prefix: "/game",
    createUUID: crypto.randomUUID,
  });

  return app;
};

module.exports = { build };
