import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/user.model';
import { NotFoundError } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(
      private usersService: UsersService,
      private jwtService: JwtService
    ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (user && user.password === pass) {
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
    const userId = this.usersService.insertUser( username, password );
    return userId;
  }

  async getAllUsers(){
    return this.usersService.getAll();
  }
} 