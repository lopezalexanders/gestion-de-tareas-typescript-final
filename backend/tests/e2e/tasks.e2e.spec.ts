import request from 'supertest';
import { beforeAll, afterAll, describe, expect, it } from 'vitest';

import app from '../../src/app.js';
import { db, closeDb } from '../../src/infra/db.js';

describe('Tasks API', () => {
  beforeAll(async () => {
    await db.migrate.latest();
  });

  afterAll(async () => {
    await db('tasks').del();
    await closeDb();
  });

  it('creates and lists tasks', async () => {
    const createResponse = await request(app).post('/tasks').send({ title: 'Nueva tarea' });
    expect(createResponse.status).toBe(201);

    const listResponse = await request(app).get('/tasks');
    expect(listResponse.status).toBe(200);
    expect(listResponse.body.items.length).toBeGreaterThanOrEqual(1);
  });
});
