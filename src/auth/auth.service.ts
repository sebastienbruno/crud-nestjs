import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
      private usersService: UsersService,
      private jwtService: JwtService,
    ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (!user) {
      throw new UnauthorizedException();
    }
    const passwordMatch = await bcrypt.compare(pass, user.password);
    if (passwordMatch) {
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

  async register(createUserDto: CreateUserDto) {
    const { username, password } = createUserDto;
    const user = await this.usersService.findOne(username);
    if (user) {
      throw new ConflictException();
    }
    const hash = await bcrypt.hash(password, 10);
    const userId = this.usersService.create( {username: username, password: hash} )
    return userId;
  }

  async getAllUsers(){
    return this.usersService.getAll();
  }
} 