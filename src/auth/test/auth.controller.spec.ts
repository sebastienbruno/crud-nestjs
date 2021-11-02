import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { JwtAuthGuard } from '../jwt-auth.guards';

describe('AuthController', () => {
  let authController: AuthController;
  let mockAuthService = {
    register: jest.fn(( dtoCreateUser: CreateUserDto ) => {
      return { 
        _id: Math.random(),
        username: dtoCreateUser.username,
        password: dtoCreateUser.password,
        __v: 0,
      };
    }),
  };
  let mockAuthGuard = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    })
      .overrideProvider(JwtAuthGuard).useValue(mockAuthGuard)
      .overrideProvider(AuthService).useValue(mockAuthService)
      .compile();

    authController = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  it('should throw a bad request', () => {
    expect.assertions(3);
    expect(authController.register( { username: '', password: 'pwd_fabien' } ))
      .rejects
      .toThrow(BadRequestException);
    expect(authController.register( { username: 'fabien', password: '' }))
      .rejects
      .toThrow(BadRequestException);
    expect(authController.register( { username: '', password: '' }))
      .rejects
      .toThrow(BadRequestException);
  });

  it('should return null', () => {
    expect.assertions(1);
    const userCreateDto = { username: 'fabien', password: 'pwd_fabien' };
    return expect(authController.register( userCreateDto ))
      .resolves
      .toBeNull();
  });
});
