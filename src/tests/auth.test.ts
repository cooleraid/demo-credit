import request from 'supertest';
import App from '../app';
import { CreateUserDto, UserLoginDto } from '../dtos/users.dto';
import AuthRoute from '../routes/auth.route';
import { getUserRecord } from './fixtures/user';
import { Users } from '../models/users.model';
import knex from '../databases';
import { Model } from 'objection';

const record = getUserRecord();
Model.knex(knex);
const clearDb = async () => {
  await Users.query().patch({ deleted: true }).where({ email: record.email });
};

beforeAll(clearDb);
afterAll(clearDb);
describe('Auth', () => {
  describe('[POST] /auth/register', () => {
    it('should create user', () => {
      const userData: CreateUserDto = record;
      const authRoute = new AuthRoute();
      const app = new App([authRoute]);
      return request(app.getApp()).post('/auth/register').send(userData).expect(201);
    });
  });

  describe('[POST] /auth/login', () => {
    it('should have an authorization token', async () => {
      const userData: UserLoginDto = record;
      const authRoute = new AuthRoute();
      const app = new App([authRoute]);
      const {
        body: { data },
      } = await request(app.getApp()).post('/auth/login').send(userData).expect(200);
      expect(data.token.token).toBeDefined();
    });
  });
});
