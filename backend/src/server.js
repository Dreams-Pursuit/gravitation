"use strict";
const { build } = require("./app");
const dataBaseOperator = require('./lib/databaseOperator.js');
build().then(app => 
  {
    dataBaseOperator.InitializeDB(app.pg);
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
  }).catch(err => console.log(err));

