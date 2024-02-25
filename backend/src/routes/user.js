"use strict"
const {userExists, addUser} = require("../lib/databaseOperator.js");
const {hashPassword} = require("../lib/hash.js");

const user = async(fastify, options, done) => {
    const {createUUID} = options;
    const regexp = /^[a-zA-Z0-9\s]*$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    fastify.post("/register", async (request, reply) =>{
        const data = request.body;
        console.log(data);
        if(!data?.email || !data?.password || !data?.username || regexp.test(data.username) || emailRegex(data.email)){
            reply.code(400).send({message:"Bad credentials!"});
        }
        if(userExists(data.email,data.username)){
            reply.code(400).send({message: "This username and(or) email has already been used"});
        }
        const codedPassword = await hashPassword(data.password);
        await addUser(data.email, data.username, codedPassword);
        reply.code(200).send({message: "The account has been successfully created!"});
    });
    done();
}

module.exports = user;