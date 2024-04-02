"use strict"
const { winnerAlgo, advancedMode } = require('./gameLogic.js');
const gameQueue = require('./gameQueue.js');
class gameManager
{
    static gameMap = new Map();
    static gameQueue;
    static startProcessing() {
        gameManager.gameQueue = new gameQueue();
        gameManager.gameQueue.startQueue();
        gameManager.gameQueue.queueEvents.addListener('startNewGame', (first, second) => gameManager.startGame(first, second));
    }
    static startGame(frst, scnd){

        //TODO: Check if the players exist

        const board = new Array(6).fill(0).map(elem => new Array(6).fill(""));
        const randomPlayer = Math.floor(Math.random() * Date.now()) % 2;
        const tempGame = {
            players: [frst, scnd],
            symbols: ["X", "O"],
            turn: randomPlayer,
            board: board,
            interval: setInterval(() => {tempGame.turn = (tempGame.turn + 1) % 2;}, 10000)
        };
        gameManager.gameMap.set(frst, tempGame);
        gameManager.gameMap.set(scnd, tempGame);
        console.log(`New game between ${frst}, ${scnd} has been successfully added!`);
    };

    static makeTurn(player ,turn)
    {
        if(!gameManager.gameMap.has(player))
            return {err: "The game does not exist!"};
        const game = gameManager.gameMap.get(player);
        if(game.players[game.turn] !== player ||
            !turn?.row || !turn?.col  || turn.row >= 6 || turn.row < 0 || turn.col >= 6 || turn.col < 0
            || game.board[turn.row][turn.col] !== "")
        {
            return {err: "Invalid turn"};
        }
        game.board[turn.row][turn.col] = game.symbols[game.turn];
        const winnerExist = winnerAlgo(game.board);
        if(winnerExist.winner)
        {
            gameManager.gameMap.delete(game.players[0]);
            gameManager.gameMap.delete(game.players[1]);

            //TODO: Make a record about a game

            return {mes: `The game has finished! The winner is ${winnerExist.winner}`, winner:winnerExist.winner};
        }
        game.turn = (game.turn + 1) % 2;
        advancedMode(game.board, turn.row, turn.col);
        clearInterval(game.interval);
        game.interval = setInterval(() => {game.turn = (game.turn + 1) % 2;}, 10000);
        return {mes: "Valid move"};
    }
}

module.exports = gameManager;