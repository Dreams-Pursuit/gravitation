const GameManager = require('../utils/gameManager');

describe('GameManager Tests', () => {
  let gameManager;

  beforeEach(() => {
    gameManager = new GameManager();
  });

  afterEach(() => {
    gameManager.gameMap.clear();
  });

  test('Starting the game should create a new game and add it to the game map', () => {
    gameManager.startGame('JohnDoe', 'JaneDoe');
    expect(gameManager.gameMap.size).toBe(2);
    expect(gameManager.gameMap.has('JohnDoe')).toBe(true);
    expect(gameManager.gameMap.has('JaneDoe')).toBe(true);
  });

  test('Making a valid turn should update the game board and return a success message', () => {
    gameManager.startGame('JohnDoe', 'JaneDoe');
    const player = 'JohnDoe';
    const turn = { row: 0, col: 0 };
    const result = gameManager.makeTurn(player, turn);
    expect(result.mes).toBe('Valid move');
    expect(gameManager.gameMap.get(player).board[0][0]).toBe('X');
  });

  test('Making an invalid turn should return an error message', () => {
    gameManager.startGame('JohnDoe', 'JaneDoe');
    const player = 'JohnDoe';
    const turn = { row: 0, col: 0 };
    gameManager.makeTurn(player, turn);
    const result = gameManager.makeTurn(player, turn);
    expect(result.err).toBe('Invalid turn');
  });

  test('Making a winning turn should delete the game from the game map and return the winner', () => {
    gameManager.startGame('JohnDoe', 'JaneDoe');
    const player1 = 'JohnDoe';
    const player2 = 'JaneDoe';
    const turn1 = { row: 0, col: 0 };
    const turn2 = { row: 1, col: 1 };
    gameManager.makeTurn(player1, turn1);
    gameManager.makeTurn(player2, turn2);
    const result = gameManager.makeTurn(player1, turn2);
    expect(result.mes).toBe('The game has finished! The winner is X');
    expect(gameManager.gameMap.has(player1)).toBe(false);
    expect(gameManager.gameMap.has(player2)).toBe(false);
  });

  test('Making a turn in a non-existing game should return an error message', () => {
    const player = 'JohnDoe';
    const turn = { row: 0, col: 0 };
    const result = gameManager.makeTurn(player, turn);
    expect(result.err).toBe('The game does not exist!');
  });

  test('Joining the game queue with an existing player should not add the player to the queue', () => {
    gameManager.startGame('JohnDoe', 'JaneDoe');
    gameManager.startProcessing();
    gameManager.gameQueue.joinQueue('JohnDoe');
    expect(gameManager.gameQueue.head).toBeNull();
    expect(gameManager.gameQueue.tail).toBeNull();
    expect(gameManager.gameQueue.presence).toEqual({});
  });

  test('Joining the game queue with a new player should add the player to the queue', () => {
    gameManager.startProcessing();
    gameManager.gameQueue.joinQueue('JohnDoe');
    expect(gameManager.gameQueue.head.val).toBe('JohnDoe');
    expect(gameManager.gameQueue.tail.val).toBe('JohnDoe');
    expect(gameManager.gameQueue.presence).toEqual({ 'JohnDoe': true });
  });
});