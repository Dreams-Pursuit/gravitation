"use strict";

const core = async (fastify, _, done) => {
  fastify.get("/", async (req, reply) => ({ hello: "world" }));

  done();
};
