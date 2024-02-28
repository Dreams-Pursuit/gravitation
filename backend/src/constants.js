"use strict";
const { pg } = require("./config");

module.exports.PLAYERS_TABLE_NAME = "players";
module.exports.PG_CONENCTION_STRING = `postgres://${pg.user}:${pg.password}@${pg.host}:${pg.port}/${pg.database}`;
