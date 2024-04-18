const fastify = require('fastify');
const { build } = require('../server');

describe('Server Tests', () => {
  let app;

  beforeAll(async () => {
    app = fastify();
    await build(app);
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  test('GET / should return status code 200', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/',
    });

    expect(response.statusCode).toBe(200);
  });

  test('POST /api/users should return status code 201', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/users',
      payload: {
        name: 'John Doe',
        email: 'john@example.com',
      },
    });

    expect(response.statusCode).toBe(201);
  });

});
