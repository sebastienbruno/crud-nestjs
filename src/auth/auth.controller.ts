import { BadRequestException, Body, Controller, Get, HttpCode, Post, Request, UseGuards } from '@nestjs/common';
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
    async register(@Body('username') username, @Body('password') password) {
      //const encryptPassword = ??
      if(!username || !password) {
        throw new BadRequestException;
      }
      const userId = await this.authService.register(username, password);
      return null;
    }

    @Get('users')
    async getAllUsers() {
      return await this.authService.getAllUsers();
    }
}
