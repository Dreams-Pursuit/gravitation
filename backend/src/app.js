"use strict";
const fastify = require("fastify");
const crypto = require("crypto");

//Routes
const game = require("./routes/game");
const user = require("./routes/user");
const build = async (opts = {}) => {
  const app = fastify(opts);
  app.register(require("@fastify/websocket"));

  app.register(game, {
    prefix: "/game",
    createUUID: crypto.randomUUID,
  });
  app.register(user, {
    prefix: "/user"
  });
  app.register(require("@fastify/postgres"), {
    connectionString: 'postgres://postgres:yuraTop4ik2004@localhost:5432/Gravitation'
  }).ready(err => {
    if (err) {
      console.error('Error connecting to PostgreSQL:', err);
      process.exit(1);
    }
    console.log('Connected to PostgreSQL database');
  });
  return app;
};

module.exports = { build };
