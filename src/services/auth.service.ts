import { hashSync, compareSync } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { SECRET_KEY } from '@config';
import { CreateUserDto } from '@dtos/users.dto';
import { HttpException } from '@exceptions/HttpException';
import { DataStoredInToken, TokenData } from '@interfaces/auth.interface';
import { User } from '@/interfaces/user.interface';
import { Users } from '@models/users.model';

class AuthService {
  public async register(userData: CreateUserDto): Promise<User> {
    if (!!!userData) throw new HttpException(400, 'Sign up info is required');

    const checkUser: User = await Users.query().select().from('users').where({ email: userData.email, deleted: false }).first();
    if (checkUser) throw new HttpException(409, `User already exists`);

    const user: User = await Users.query().insertAndFetch({ ...userData, password: hashSync(userData.password, 10) });
    return user;
  }

  public async login(userData: CreateUserDto): Promise<{ token: TokenData; user: User }> {
    if (!!!userData) throw new HttpException(400, 'login credentials is required');

    const user: User = await Users.query().select().from('users').where({ email: userData.email, deleted: false }).first();
    if (!user || !user.password || !compareSync(userData.password, user.password)) throw new HttpException(409, 'Invalid login credentials');

    const token = this.createToken(user);

    return { token, user };
  }

  public createToken(user: User): TokenData {
    const dataStoredInToken: DataStoredInToken = { id: user.id };
    const secretKey: string = SECRET_KEY;
    const expiresIn = 60 * 60;

    return { expiresIn, token: sign(dataStoredInToken, secretKey, { expiresIn }) };
  }
}

export default AuthService;
