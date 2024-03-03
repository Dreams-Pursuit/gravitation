"use strict"

class gameQueue
{
    constructor(){
        this.queue = [];
        this.gamesMap = new Map();
        this.interval = null;
    };
    joinQueue(username){
        this.queue.push(username);
        console.log(`Player ${username} has successfully joined the queue!`);
    };
    startQueue()
    {
        this.interval = setInterval(() => {
            if(this.queue.length >= 2){
                console.log("Creating a new game!");
                const firstPlayer = this.queue.shift();
                const secondPlayer = this.queue.shift();
                this.startGame(firstPlayer, secondPlayer);
            }else{
                console.log("Queue is empty :(");
            }
        }, 5000);
        console.log("The queue started");
    };
    endQueue()
    {
        clearInterval(this.interval);
    }
    startGame(frst, scnd){
        const board = new Array(6).fill(0).map(elem => new Array(6).fill(""));
        const randomPlayer = (Math.random() * Date.now()) % 2;
        const tempGame = {
            players: [frst, scnd],
            symbols: ["X", "O"],
            turn: randomPlayer,
            board: board
        };
        this.gamesMap.set(frst, tempGame);
        this.gamesMap.set(scnd, tempGame);
        console.log("New game has been successfully added!");
    }
}

module.exports = gameQueue;