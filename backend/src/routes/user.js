"use strict"
import {userExists, addUser} from "../utils/databaseOperator.js"

const user = async(fastify, options) => {
    const {createUUID} = options;
    const regexp = /^[a-zA-Z0-9\s]*$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    fastify.get("/register", async (request, reply) =>{
        const data = JSON.parse(request);

        if(!data?.email || !data?.password || !data?.username || regexp.test(data.username) || emailRegex(data.email)){
            reply.code(400).send({message:"Bad credentials!"});
        }

        if(await userExists(fastify.pg,data.email,data.username)){
            reply.code(400).send({message: "This username and(or) email has already been used"});
        }

        await addUser(fastify.pg, data.email, data.username, data.password);
        reply.code(200).send({message: "The account has been successfully created!"});
    })
}