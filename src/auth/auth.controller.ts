import { BadRequestException, Body, Controller, Get, HttpCode, Post, Request, ServiceUnavailableException, UseGuards } from '@nestjs/common';
import { User } from 'src/users/schemas/user.schema';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService){}

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Request() req) {
      let access_token;
      try { 
        access_token = await this.authService.login(req.user);
        return access_token;
      }
      catch(e) {
        throw new ServiceUnavailableException('The login service is unavailable');
      }
    }

    @HttpCode(201)
    @Post('register')
    async register(@Body() createUserDto: CreateUserDto) {
      const { username, password } = createUserDto;
      if(!username || !password) {
        throw new BadRequestException;
      }
      let user: User;
      try {
        user = await this.authService.register(createUserDto);
        if(!user) {
          throw new ServiceUnavailableException('The registration service is unavailable');
        }
      }
      catch(e) {
        throw new ServiceUnavailableException(e, 'The registration service is unavailable');
      }
      return null;
    }

    @Get('users')
    async getAllUsers() {
      let users:User[];
      try {
        users = await this.authService.getAllUsers();
      }
      catch(e) {
        throw new ServiceUnavailableException(e, 'The service is unavailable');
      }
    }
}
