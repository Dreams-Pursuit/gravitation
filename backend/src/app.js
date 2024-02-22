"use strict";
const fastify = require("fastify");

//Routes
const game = require("../routes/game");

const build = (opts = {}) => {
  const app = fastify(opts);
  app.register(game, { prefix: "/game" });

  return app;
};

module.exports = { build };
