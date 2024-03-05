"use strict"

function ListNode(val, next){
    this.val = (val === undefined ? null : val);
    this.next = (next === undefined ? null : next);
}

class gameQueue
{
    constructor(){
        this.head = null;
        this.tail = null;
        this.presence = {};
        this.queueLength = 0;
        this.gamesMap = new Map();
        this.interval = null;
    };
    joinQueue(username){
        if(typeof username !== 'string'){
            console.log("Invalid username");
            return;
        }
        if(this.presence.hasOwnProperty(username)){
            console.log("Failed to join the queue - this user is already in the queue");
            return;
        }
        this.presence[username] = true;
        let temp = new ListNode(username);
        if(this.head == null){
            this.head = temp;
            this.tail = temp;
        }else{
            this.tail.next = temp;
            this.tail = temp;
        }
        this.queueLength++;
    };
    popQueue(){
        if(this.head == null){
            return null;
        }
        let temp = this.head;
        if(this.head == this.tail){
            this.head = null;
            this.tail = null;
        }else{
            let curr = this.head.next;
            temp.next = null;
            this.head = curr;
        }
        delete this.presence[temp.val];
        this.queueLength--;
        return temp.val;
    }
    startQueue()
    {
        this.interval = setInterval(() => {
            if(this.queueLength >= 2){
                console.log("Creating a new game!");
                const firstPlayer = this.popQueue();
                const secondPlayer = this.popQueue();
                this.startGame(firstPlayer, secondPlayer);
            }else{
                console.log("Queue is empty :(");
                console.log(this.gamesMap);
            }
        }, 5000);
        console.log("The queue started");
    };
    endQueue()
    {
        clearInterval(this.interval);
    };
    startGame(frst, scnd){
        const board = new Array(6).fill(0).map(elem => new Array(6).fill(""));
        const randomPlayer = Math.floor(Math.random() * Date.now()) % 2;
        const tempGame = {
            players: [frst, scnd],
            symbols: ["X", "O"],
            turn: randomPlayer,
            board: board
        };
        this.gamesMap.set(frst, tempGame);
        this.gamesMap.set(scnd, tempGame);
        console.log("New game has been successfully added!");
    };
}

module.exports = gameQueue;