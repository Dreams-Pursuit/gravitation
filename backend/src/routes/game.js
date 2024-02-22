"use strict";

const game = async (fastify, _, done) => {
  fastify.get("/", async (req, reply) => ({ hello: "world" }));

  done();
};

module.exports = game;
