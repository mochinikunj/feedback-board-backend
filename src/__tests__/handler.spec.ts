import { app } from '../handler';
import supertest from 'supertest';

describe('handler.ts', () => {
  it('Should call health-check api', (done) => {
    supertest(app).get('/health-check').expect(200, done);
  });
});
