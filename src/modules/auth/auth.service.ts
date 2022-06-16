import { HttpService, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { compare, hash } from 'bcrypt';
import { StatusException } from '../../common/exceptions/status.exception';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
    private readonly httpService: HttpService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (!user) return null;
    const isMatch = await compare(pass, user.password);
    if (isMatch && user.isActive == true) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(req: any) {
    const user = await this.validateUser(req.body.username, req.body.password);
    if (user) {
      const { username, userId } = user;
      const payload = { username: username, sub: userId };
      return {
        access_token: this.jwtService.sign(payload),
        user: user,
      };
    } else {
      throw new StatusException(
        {
          status: 401,
          message: 'Invalid Username or Password!',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
