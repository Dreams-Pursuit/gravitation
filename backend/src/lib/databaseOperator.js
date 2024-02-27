"use strict";
const crud = require("./db.js");
const playerTable = crud("players");

async function userExists(email, name) {
  const response = await playerTable.read({
        data:{
            user_email:email,
            user_name:name
        },
        logic:"OR"
    });
  return response.rows.length !== 0;
}

async function addUser(email, name, password) {
  await playerTable.create({
        user_email:email,
        user_name:name,
        user_password:password
  });
}

async function getPasswordByEmail(email){
  const response = await playerTable.read({
    data:{
      user_email:email
    }
  });
  return response.rows;
}
module.exports = { addUser, userExists, getPasswordByEmail };
