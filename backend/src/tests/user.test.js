const fastify = require('fastify');
const { build } = require('../server');
const { hashPassword, validatePassword, generateToken } = require('../utils');

describe('User Routes Tests', () => {
  let app;

  beforeAll(async () => {
    app = fastify();
    await build(app);
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  test('POST /register with valid credentials should return status code 200', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/register',
      payload: {
        username: 'JohnDoe',
        email: 'john@example.com',
        password: 'password123',
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expect.objectContaining({
      message: 'The account has been successfully created!',
      token: expect.any(String),
    }));
  });

  test('POST /register with invalid credentials should return status code 400', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/register',
      payload: {
        username: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      },
    });

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual(expect.objectContaining({
      message: 'Bad credentials!',
    }));
  });

  test('POST /login with valid credentials should return status code 200', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/login',
      payload: {
        email: 'john@example.com',
        password: 'password123',
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expect.objectContaining({
      message: 'Successfully logged in!',
      token: expect.any(String),
    }));
  });

  test('POST /login with invalid credentials should return status code 400', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/login',
      payload: {
        email: 'john@example.com',
        password: 'wrongpassword',
      },
    });

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual(expect.objectContaining({
      message: 'Failed to login, maybe wrong credentials!',
    }));
  });

  test('POST /:userName with valid token should return user details', async () => {
    const token = generateToken({ username: 'JohnDoe' });

    const response = await app.inject({
      method: 'POST',
      url: '/JohnDoe',
      payload: {
        token: token,
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expect.objectContaining({
      username: 'JohnDoe',
      userRating: expect.any(Number),
      userFriends: expect.any(Array),
    }));
  });

  test('POST /:userName with invalid token should return status code 400', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/JohnDoe',
      payload: {
        token: 'invalidtoken',
      },
    });

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual(expect.objectContaining({
      message: 'Wrong token, access denied!',
    }));
  });



});const fastify = require('fastify');
const { build } = require('../server');
const { hashPassword, validatePassword, generateToken } = require('../utils');
const dataBaseOperator = require('../utils/dataBaseOperator');

describe('User Routes Tests', () => {
  let app;

  beforeAll(async () => {
    app = fastify();
    await build(app);
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  test('POST /register with valid credentials should return status code 200', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/register',
      payload: {
        username: 'JohnDoe',
        email: 'john@example.com',
        password: 'password123',
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expect.objectContaining({
      message: 'The account has been successfully created!',
      token: expect.any(String),
    }));
  });

  test('POST /register with invalid credentials should return status code 400', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/register',
      payload: {
        username: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      },
    });

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual(expect.objectContaining({
      message: 'Bad credentials!',
    }));
  });

  test('POST /login with valid credentials should return status code 200', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/login',
      payload: {
        email: 'john@example.com',
        password: 'password123',
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expect.objectContaining({
      message: 'Successfully logged in!',
      token: expect.any(String),
    }));
  });

  test('POST /login with invalid credentials should return status code 400', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/login',
      payload: {
        email: 'john@example.com',
        password: 'wrongpassword',
      },
    });

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual(expect.objectContaining({
      message: 'Failed to login, maybe wrong credentials!',
    }));
  });

  test('POST /:userName with valid token should return user details', async () => {
    const token = generateToken({ username: 'JohnDoe' });

    const response = await app.inject({
      method: 'POST',
      url: '/JohnDoe',
      payload: {
        token: token,
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expect.objectContaining({
      username: 'JohnDoe',
      userRating: expect.any(Number),
      userFriends: expect.any(Array),
    }));
  });

  test('POST /:userName with invalid token should return status code 400', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/JohnDoe',
      payload: {
        token: 'invalidtoken',
      },
    });

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual(expect.objectContaining({
      message: 'Wrong token, access denied!',
    }));
  });


});