import { ConflictException, ConsoleLogger, Injectable, NotFoundException, ServiceUnavailableException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from 'src/users/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
      private usersService: UsersService,
      private jwtService: JwtService,
    ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    let user;
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
        else {
          throw new UnauthorizedException();
        }
      }
    }
    catch(e) {
      throw e;
    }
  }

  login(user: any) {
      const payload = { username: user.username, sub: user.userId };
      return {
          access_token: this.jwtService.sign(payload),
      };
  }

  async register(createUserDto: CreateUserDto) {
    const { username, password } = createUserDto;
    let user: User;
    try {
      user = await this.usersService.findOne(username);
    }
    catch(e) {
      throw new ServiceUnavailableException(e, 'The register service is unavailable due to find service');
    }
    if (user) {
      throw new ConflictException(`The user ${username} already exist`);
    }
   try {
      const hash = await bcrypt.hash(password, 10);
      user = await this.usersService.create( {username: username, password: hash} );
    }
    catch (e) {
      throw new ServiceUnavailableException(e, 'The register service is unavailable');
    }
    return user;
  }

  async getAllUsers(){
    const users = await this.usersService.getAll();
    return users;
  }
} 