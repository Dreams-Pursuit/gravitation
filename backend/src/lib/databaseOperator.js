"use strict";
const crud = require("./db.js");
const playerTable = crud("players");
class databaseOperator{
  static async userExists(email, name) {
    const response = await playerTable.read({
          data:{
              user_email:email,
              user_name:name
          },
          logic:"OR"
      });
    return response.rows.length !== 0;
  }
  
  static async addUser(email, name, password) {
    await playerTable.create({
          user_email:email,
          user_name:name,
          user_password:password
    });
  }
  static async userNameExists(name){
    const response = await playerTable.read({
      data:{
        user_name:name
      }
    });
    return response.rows;
  }
  
  static async getPasswordByEmail(email){
    const response = await playerTable.read({
      data:{
        user_email:email
      }
    });
    return response.rows;
  }
}


module.exports = { databaseOperator };
