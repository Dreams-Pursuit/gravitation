"use strict"
const dataBaseOperator = require("../lib/databaseOperator.js");
const { hashPassword, validatePassword } = require("../lib/hash.js");
const { generateToken, validateToken } = require("../lib/token.js");

const user = async(fastify, options, done) => {
    // REGEX is tricky in a way that they may be a bottleneck 
    const regexp = /^[a-zA-Z0-9\s]*$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^[^\s,*]+$/;

    fastify.post("/register", async (request, reply) =>{
        const data = request.body;
        if(!data?.email || !data?.password || !data?.username || !regexp.test(data.username) || !emailRegex.test(data.email) || !passwordRegex.test(data.password)){
            reply.code(400).send({message:"Bad credentials!"});
            return;
        }
        const exists = await dataBaseOperator.read('players', { user_name : data.username })
        if(exists.length != 0){
            reply.code(400).send({message: "This username and(or) email has already been used"});
            return;
        }
        const codedPassword = await hashPassword(data.password);
        dataBaseOperator.create('players', {user_name : data.username, user_email: data.email, user_password: codedPassword});
        const token = generateToken({username:data.username});
        reply.code(200).send({message: "The account has been successfully created!", token:token});
    });
    fastify.post("/login", async (request, reply) => {
        const data = request.body;
        if(!data?.email || !data?.password || !emailRegex.test(data.email) || !passwordRegex.test(data.password)){
            reply.code(400).send({message: "Bad format of credentials"});
            return;
        }
        const credentials = await dataBaseOperator.read('players', {user_email : data.email});
        if(credentials.length === 0){
            reply.code(400).send({message: "Account with this email does not exist!"});
            return;
        }
        if(await validatePassword(data.password,credentials[0].user_password)){
            const token = generateToken({username:credentials[0].user_name});
            reply.code(200).send({message: "Successfully logged in!", token : token});
        }else{
            reply.code(400).send({message: "Failed to login, maybe wrong credentials!"});
        }
    })
    fastify.post("/:userName", async (request, reply) =>{
        const { userName } = request.params;
        const data = request.body;
        if(!data?.token || !regexp.test(userName)){
            reply.code(400).send({message: "Wrong format of user id!"});
            return;
        }
        const user = await dataBaseOperator.read('players', {user_name : userName});
        if(user.length === 0){
            reply.code(400).send({message: "This username does not exist!"});
            return;
        }
        console.log(user);
        switch(validateToken(data.token)){
            case 0:
                reply.code(400).send({message:"Your token has expired, please log in once more to obtain a new one!"});
                return;
            case -1:
                reply.code(400).send({message: "Wrong token, access denied!"});
                return;
            default:
                break;
        }
        reply.code(200).send({
            username: user[0].user_name,
            userRating: user[0].user_rating,
            userFriends: user[0].user_friends
        })
    })
    done();
}

module.exports = user;