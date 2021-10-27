import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/user.model';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
      private usersService: UsersService,
      private jwtService: JwtService,
      private configService: ConfigService
    ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    const passwordMatch = await bcrypt.compare(pass, user.password);
    if (user && passwordMatch) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
      const payload = { username: user.username, sub: user.userId };
      return {
          access_token: this.jwtService.sign(payload),
      };
  }

  async register(username: string, password: string){
    const user = await this.usersService.findOne(username);
    if (user) {
      throw new ConflictException();
    }
    const hash = await bcrypt.hash(password, 10);
    const userId = this.usersService.insertUser( username, hash );
    return userId;
  }

  async getAllUsers(){
    return this.usersService.getAll();
  }
} 