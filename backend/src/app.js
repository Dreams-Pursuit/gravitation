"use strict";
const fastify = require("fastify");
const crypto = require("crypto");

const { PLAYERS_TABLE_NAME, PG_CONENCTION_STRING } = require("./constants");
const crud = require("./lib/db/db.js");

//Routes
const game = require("./routes/game");
const user = require("./routes/user");


const build = (opts = {}) => {
  const app = fastify(opts);

  // Register plugins
  app.register(require("@fastify/websocket"));

  // Register database connection
  app
    .register(require("@fastify/postgres"), {
      connectionString: PG_CONENCTION_STRING,
    })
    .ready((err) => {
      if (err) {
        app.log.error("Error connecting to PostgreSQL:", err);
        process.exit(1);
      }
      app.log.info("Connected to PostgreSQL database");
    });
  // Register routes
  // FIX: Use a decorator to register the database provider
  const dbProvider = require("./lib/db/dbProvider.js")(crud(app.pg)(PLAYERS_TABLE_NAME));
  app.register(game, {
    prefix: "/game",
    createUUID: crypto.randomUUID,
  });

  app.register(user, {
    prefix: "/user",
    databaseProvider: dbProvider,
  });

  return app;
};

module.exports = { build };
