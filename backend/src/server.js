"use strict";
const { build } = require("./app");

const OPTIONS = {
  port: 3000,
};

const app = build({ logger: true });

app.listen(OPTIONS, (err, address) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  app.log.info(`server listening on ${address}`);
});
