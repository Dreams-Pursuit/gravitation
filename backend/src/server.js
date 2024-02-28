"use strict";
const { build } = require("./app");

const app = build({ logger: true });

const OPTIONS = {
  port: 3000,
};

app.listen(OPTIONS, (err, address) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  app.log.info(`server listening on ${address}`);
});
