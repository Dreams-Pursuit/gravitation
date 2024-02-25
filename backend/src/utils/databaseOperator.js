"use strict"

function userExists(db, email, name){
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM GravitationPlayer WHERE user_email = ${email} OR user_name = ${name}`, (error, duplicateRespose) =>{
            if(error)reject(error);
            if(duplicateRespose.rows.length != 0)resolve(false);
            else resolve(true);
        })
    })
}

function addUser(db, email, name, password){
    return new Promise((resolve, reject) => {
        db.query(`INSERT INTO GravitationPlayer ("user_id","user_name", "user_email", "user_password", "user_rating", "user_friends") VALUES ('${1}', '${name}', '${email}', '${password}', '${1000}', '${[]}')`,
        (err, result) => {
            if(err){
                throw err;
            }
        });
    });
}
export {userExists, addUser};