import { Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ApiResponse } from '../../common/response/api.response';
import { UserRepository } from './user.repository';
import UserNotFoundException from './exceptions/user-not-found.exception';
import * as bcrypt from 'bcrypt';
import { SALT_OR_ROUND } from '../../common/utils/message';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(UserRepository)
    private usersRepository: UserRepository,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<ApiResponse> {
    const user = new User();
    user.fullName = createUserDto.fullName;
    user.username = createUserDto.username;
    // const password = Math.floor(1000 + Math.random() * 9000).toString();
    const password = createUserDto.password;
    const hash = await bcrypt.hash(password, SALT_OR_ROUND);
    user.password = hash;
    user.roles = createUserDto.roles;
    user.isActive = true;
    await this.usersRepository.save(user);
    return new ApiResponse(201, 'User Created Successfully', user.userId);
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const user = new User();
    user.isActive = true;
    user.username = createUserDto.username;
    return await this.usersRepository.save(user);
  }

  async findOne(username: string): Promise<User> {
    return this.usersRepository.findOne({ where: { username } });
  }

  async findById(id: number): Promise<User> {
    const user = await this.usersRepository.findOne(id);
    if (!user) {
      this.logger.error(`User ${id} not found`);
      throw new UserNotFoundException(id);
    }
    return user;
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.softDelete(id);
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<any> {
    const user = await this.findById(id);
    if (user) {
      user.username = updateUserDto.username;
      user.roles = updateUserDto.roles;
      await this.usersRepository.save(user);
      return new ApiResponse(
        201,
        'User updated successfully with ID: ' + id,
        id,
      );
    } else {
      return new ApiResponse(404, 'User Not Found');
    }
  }

  loginToTucPortal() {
    console.log('Api Called.....');
    const url =
      'https://wtc.tu-chemnitz.de/krb/module.php/core/loginuserpass.php?';
    const data: any = {
      password: 'Zahid#Tu123',
      AuthState:
        '_d6fb9a370f245c3bb57a1098bda5d89073cb2c01f9:https://wtc.tu-chemnitz.de/krb/saml2/idp/SSOService.php?spentityid=https%3A%2F%2Fcampus.tu-chemnitz.de%2Fshibboleth&RelayState=ss%3Amem%3Aa49e36ebe38219162ebbb03c1a3f0ee4701cd51914f8cfc0718f39fe56c37a85&cookieTime=1655245460',
    };
    const options: any = {};
    /*this.httpService.post(url, data, null).pipe(
      // tap((resp) => console.log(resp)),
      map((resp) => resp.data),
      // tap((data) => console.log(data)),
    );*/
    console.log('Api Called.....1');

    /*router.get('/', function (req, res, next) {
      request({
        uri: 'http://www.giantbomb.com/api/search',
        qs: {
          api_key: '123456',
          query: 'World of Warcraft: Legion',
        },
        function(error, response, body) {
          if (!error && response.statusCode === 200) {
            console.log(body);
          }
        },
      });
    });*/
  }
}
