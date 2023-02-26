import request from 'supertest';
import App from '../app';
import HealthRoute from '../routes/health.route';

afterAll(async () => {
  await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
});

describe("Testing App's Health", () => {
  describe('[GET] /', () => {
    it('response statusCode 200', () => {
      const route = new HealthRoute();
      const app = new App([route]);
      return request(app.getApp()).get(`${route.path}`).expect(200);
    });
  });
  describe('[GET] /health', () => {
    it('response statusCode 200', () => {
      const route = new HealthRoute();
      const app = new App([route]);
      return request(app.getApp()).get(`${route.path}`).expect(200);
    });
  });
});
