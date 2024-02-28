"use strict";
const fastify = require("fastify");
const crypto = require("crypto");

//Routes
const game = require("./routes/game");
const user = require("./routes/user");


const CONENCTION_STRING = "postgres://postgres:yuraTop4ik2004@localhost:5432/Gravitation";
const build = (opts = {}) => {
  const app = fastify(opts);

  // Register plugins
  app.register(require("@fastify/websocket"));

  // Register database connection
  app.register(require("@fastify/postgres"), {
    connectionString: CONENCTION_STRING
  }).ready(err => {
    if (err) {
      console.error('Error connecting to PostgreSQL:', err);
      process.exit(1);
    }
    console.log('Connected to PostgreSQL database');
  });

  // Register routes
  app.register(game, {
    prefix: "/game",
    createUUID: crypto.randomUUID,
  });

  app.register(user, {
    prefix: "/user"
  });

  return app;
};

module.exports = { build };
