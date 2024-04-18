const EventEmitter = require('events');
const GameQueue = require('../utils/gameQueue');

describe('GameQueue Tests', () => {
  let gameQueue;

  beforeEach(() => {
    gameQueue = new GameQueue();
  });

  afterEach(() => {
    gameQueue.endQueue();
  });

  test('Joining the queue should add the user to the queue', () => {
    gameQueue.joinQueue('JohnDoe');
    expect(gameQueue.head.val).toBe('JohnDoe');
    expect(gameQueue.tail.val).toBe('JohnDoe');
    expect(gameQueue.presence).toEqual({ 'JohnDoe': true });
  });

  test('Joining the queue with invalid username should not add the user to the queue', () => {
    gameQueue.joinQueue(123);
    expect(gameQueue.head).toBeNull();
    expect(gameQueue.tail).toBeNull();
    expect(gameQueue.presence).toEqual({});
  });

  test('Joining the queue with an existing username should not add the user to the queue', () => {
    gameQueue.joinQueue('JohnDoe');
    gameQueue.joinQueue('JohnDoe');
    expect(gameQueue.head.val).toBe('JohnDoe');
    expect(gameQueue.tail.val).toBe('JohnDoe');
    expect(gameQueue.presence).toEqual({ 'JohnDoe': true });
  });

  test('Popping the queue should remove and return the first user in the queue', () => {
    gameQueue.joinQueue('JohnDoe');
    gameQueue.joinQueue('JaneDoe');
    const firstPlayer = gameQueue.popQueue();
    expect(firstPlayer).toBe('JohnDoe');
    expect(gameQueue.head.val).toBe('JaneDoe');
    expect(gameQueue.tail.val).toBe('JaneDoe');
    expect(gameQueue.presence).toEqual({ 'JaneDoe': true });
  });

  test('Popping the queue when the queue is empty should return null', () => {
    const player = gameQueue.popQueue();
    expect(player).toBeNull();
  });

  test('Starting the queue should create a new game when there are at least two players in the queue', () => {
    const mockEmit = jest.spyOn(gameQueue.queueEvents, 'emit');
    gameQueue.joinQueue('JohnDoe');
    gameQueue.joinQueue('JaneDoe');
    gameQueue.startQueue();
    jest.advanceTimersByTime(5000);
    expect(mockEmit).toHaveBeenCalledWith('startNewGame', 'JohnDoe', 'JaneDoe');
  });

  test('Starting the queue when there is only one player in the queue should not create a new game', () => {
    const mockEmit = jest.spyOn(gameQueue.queueEvents, 'emit');
    gameQueue.joinQueue('JohnDoe');
    gameQueue.startQueue();
    jest.advanceTimersByTime(5000);
    expect(mockEmit).not.toHaveBeenCalled();
  });

  test('Starting the queue when the queue is empty should not create a new game', () => {
    const mockEmit = jest.spyOn(gameQueue.queueEvents, 'emit');
    gameQueue.startQueue();
    jest.advanceTimersByTime(5000);
    expect(mockEmit).not.toHaveBeenCalled();
  });

  test('Ending the queue should stop the interval', () => {
    gameQueue.startQueue();
    gameQueue.endQueue();
    expect(gameQueue.interval).toBeNull();
  });
});