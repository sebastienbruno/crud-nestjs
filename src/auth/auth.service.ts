import { ConflictException, ConsoleLogger, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
      private usersService: UsersService,
      private jwtService: JwtService,
    ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    let user = null;
    try {
      user = await this.usersService.findOne(username);
      if (!user) {
        throw new UnauthorizedException();
      }
      if(pass && user.password) {
        const passwordMatch = await bcrypt.compare(pass, user.password);
        if (passwordMatch) {
          const { password, ...result } = user;
          return result;
        }
      }
    }
    catch(e) {
      throw e;
    }
    return null;
  }

  async login(user: any) {
      const payload = { username: user.username, sub: user.userId };
      return {
          access_token: this.jwtService.sign(payload),
      };
  }

  async register(createUserDto: CreateUserDto) {
    const { username, password } = createUserDto;
    let user;
    try {
      user = await this.usersService.findOne(username);
    }
    catch(e) {
      throw new NotFoundException(e);
    }
    if (user) {
      throw new ConflictException();
    }
    let hash;
    try {
      hash = await bcrypt.hash(password, 10);
    }
    catch(e) {
      throw e;
    }
    let userId;
    try {
      userId = await this.usersService.create( {username: username, password: hash} );
    }
    catch (e) {
      throw e;
    }
    return userId;
  }

  async getAllUsers(){
    return this.usersService.getAll();
  }
} 