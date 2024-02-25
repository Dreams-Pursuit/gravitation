"use strict";
const crud = require("./db.js");
const playerTable = crud("players");

function userExists(email, name) {
  const response = playerTable.read({
        data:{
            user_email:email,
            user_name:name
        },
        logic:"OR"
    });
  if(response.length !== 0){
    return true;
  }
  else{
    return false;
  }
}

function addUser(email, name, password) {
  return new Promise(() => {
    playerTable.create({
        user_email:email,
        user_name:name,
        user_password:password
    })
  });
}
module.exports = { addUser, userExists };
