const { validateToken } = require('../lib/token');

describe('Token Validation Tests', () => {
  test('Valid token should return 1', () => {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkpvaG5Eb2UiLCJpYXQiOjE2MzIwMzIwMjMsImV4cCI6MTYzMjAzMjAyM30.2zvXeYv0XJ8J8j3z9z8j8zJ8XJ8zJ8zJ8XJ8zJ8zJ8z';

    const result = validateToken(token, 'JohnDoe');

    expect(result).toBe(1);
  });

  test('Invalid token should return -1', () => {
    const token = 'invalidtoken';

    const result = validateToken(token, 'JohnDoe');

    expect(result).toBe(-1);
  });

  test('Expired token should return 0', () => {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkpvaG5Eb2UiLCJpYXQiOjE2MzIwMzIwMjMsImV4cCI6MTYzMjAzMjAyMzB9.2zvXeYv0XJ8J8j3z9z8j8zJ8XJ8zJ8zJ8XJ8zJ8zJ8z';

    const result = validateToken(token, 'JohnDoe');

    expect(result).toBe(0);
  });

  test('Token with wrong username should return -1', () => {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkpvaG5EZG9lIiwiaWF0IjoxNjMyMDMyMDIzLCJleHAiOjE2MzIwMzIwMjMzfQ.2zvXeYv0XJ8J8j3z9z8j8zJ8XJ8zJ8zJ8XJ8zJ8zJ8z';

    const result = validateToken(token, 'JohnDoe');

    expect(result).toBe(-1);
  });
});