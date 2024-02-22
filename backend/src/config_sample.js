"use strict";
//Rename to config.js to use the following configuration file.

module.exports = {
  db: {
    host: "127.0.0.1",
    port: 5432,
    database: "example",
    user: "admin",
    password: "admin",
  },
  pg: {
    database: "postgres",
    user: "postgres",
    password: "postgres",
  }
};
