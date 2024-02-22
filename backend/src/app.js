"use strict";
const fastify = require("fastify");

const build = (opts = {}) => {
  const app = fastify(opts);
  return app;
};

module.exports = { build };
