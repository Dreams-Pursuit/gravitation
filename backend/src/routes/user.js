"use strict"
const {userExists, addUser, getPasswordByEmail} = require("../lib/databaseOperator.js");
const {hashPassword, validatePassword} = require("../lib/hash.js");

const user = async(fastify, options, done) => {
    const {createUUID} = options;
    const regexp = /^[a-zA-Z0-9\s]*$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^[^\s,*]+$/;

    fastify.post("/register", async (request, reply) =>{
        const data = request.body;
        if(!data?.email || !data?.password || !data?.username || !regexp.test(data.username) || !emailRegex.test(data.email) || !passwordRegex.test(data.password)){
            reply.code(400).send({message:"Bad credentials!"});
            return;
        }
        if(await userExists(data.email,data.username)){
            reply.code(400).send({message: "This username and(or) email has already been used"});
            return;
        }
        const codedPassword = await hashPassword(data.password);
        await addUser(data.email, data.username, codedPassword);
        reply.code(200).send({message: "The account has been successfully created!"});
    });
    fastify.post("/login", async (request, reply) => {
        const data = request.body;
        if(!data?.email || !data?.password || !emailRegex.test(data.email) || !passwordRegex.test(data.password)){
            reply.code(400).send({message: "Bad format of credentials"});
            return;
        }
        const credentials = await getPasswordByEmail(data.email);
        console.log(credentials);
        if(credentials.length === 0){
            reply.code(400).send({message: "Account with this email does not exist!"});
            return;
        }
        if(await validatePassword(data.password,credentials[0].user_password)){
            reply.code(200).send({message: "Successfully logged in!"});
        }else{
            reply.code(400).send({message: "Failed to login, maybe wrong credentials!"});
        }
    })
    done();
}

module.exports = user;