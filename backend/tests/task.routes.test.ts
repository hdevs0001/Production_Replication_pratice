// tests/task.routes.test.ts
import request from 'supertest';
import app from '../src/app';

describe('Task routes', () => {
  let createdId: string;

  it('POST /api/tasks creates a task', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({ title: 'Integration test task' });

    expect(res.status).toBe(201);
    expect(res.body.title).toBe('Integration test task');
    expect(res.body.completed).toBe(false);
    createdId = res.body.id;
  });

  it('POST /api/tasks returns 400 when title is missing', async () => {
    const res = await request(app).post('/api/tasks').send({});
    expect(res.status).toBe(400);
  });

  it('GET /api/tasks/:id returns the created task', async () => {
    const res = await request(app).get(`/api/tasks/${createdId}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(createdId);
  });

  it('GET /api/tasks/:id returns 404 for an unknown id', async () => {
    const res = await request(app).get(
      '/api/tasks/00000000-0000-0000-0000-000000000000'
    );
    expect(res.status).toBe(404);
  });

  it('PATCH /api/tasks/:id marks the task completed', async () => {
    const res = await request(app)
      .patch(`/api/tasks/${createdId}`)
      .send({ completed: true });

    expect(res.status).toBe(200);
    expect(res.body.completed).toBe(true);
  });

  it('GET /api/tasks/stats reflects the completed task', async () => {
    const res = await request(app).get('/api/tasks/stats');
    expect(res.status).toBe(200);
    expect(res.body.total).toBeGreaterThanOrEqual(1);
  });

  it('DELETE /api/tasks/:id removes the task', async () => {
    const res = await request(app).delete(`/api/tasks/${createdId}`);
    expect(res.status).toBe(204);
  });

  it('GET /api/tasks/:id returns 404 after deletion', async () => {
    const res = await request(app).get(`/api/tasks/${createdId}`);
    expect(res.status).toBe(404);
  });
});