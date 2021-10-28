import { BadRequestException, Body, Controller, Get, HttpCode, Post, Request, UseGuards } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService){}

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Request() req) {
      return await this.authService.login(req.user);
    }

    @HttpCode(201)
    @Post('register')
    async register(@Body() createUserDto: CreateUserDto) {
      const { username, password } = createUserDto;
      if(!username || !password) {
        throw new BadRequestException;
      }
      const userId = await this.authService.register(createUserDto);
      return null;
    }

    @Get('users')
    async getAllUsers() {
      return await this.authService.getAllUsers();
    }
}
