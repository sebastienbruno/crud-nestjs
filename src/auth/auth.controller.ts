import { BadRequestException, Body, Controller, Get, HttpCode, Param, Post, Request, ServiceUnavailableException, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { User } from 'src/users/schemas/user.schema';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService){}

    @UseGuards(LocalAuthGuard)
    @ApiOperation({ 
      summary: 'Log in service. In return you will obtain an access token.',
    })
    @Post('login')
    @ApiBody({ 
      schema: {
        type: 'object',
        properties:  {
          username: {
            type: 'string'
          },
          password: {
            type: 'string'
          }
        }
      }
    })
    @ApiResponse({ status: 200, description: 'The request has been fulfilled succesfully.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @ApiResponse({ status: 503, description: 'The server cannot handle the request.' })
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

    @ApiOperation({ 
      summary: 'This service allows you to register a new user.',
    })
    @ApiResponse({ status: 201, description: 'The request has been fulfilled, resulting in the creation of a new user.' })
    @ApiResponse({ status: 503, description: 'The server cannot handle the request.' })
    @ApiResponse({ status: 400, description: 'The server cannot or will not process the request due to a bad request.' })
    @Post('register')
    async register(@Body() createUserDto: CreateUserDto) {
      const { username, password } = createUserDto;
      if(!username || !password) {
        throw new BadRequestException;
      }
      let user: User;
      user = await this.authService.register(createUserDto);
      if(!user) {
        throw new ServiceUnavailableException('The registration service is unavailable');
      }
      return null;
    }

    @Get('users')
    @ApiResponse({ status: 200, description: 'The request has been fulfilled succesfully.' })
    @ApiOperation({ 
      summary: '[Private service - Do not expose] This service allows you to get all users informations. Env dev only',
    })
    async getAllUsers() {
      let users:User[];
      try {
        users = await this.authService.getAllUsers();
        return users;
      }
      catch(e) {
        throw new ServiceUnavailableException(e, 'The service is unavailable');
      }
    }
}
