import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../../users/users.service';
import { AuthService } from '../auth.service';
import * as bcrypt from 'bcrypt';


describe('AuthService', () => {
  let service: AuthService;

  const bcryptCompare = jest.fn().mockResolvedValue(true);
  (bcrypt.compare as jest.Mock) = bcryptCompare;
  
  let mockUserService = {
    findOne: jest.fn((username: string, password: string) => {
      return {
        _id: 1234,
        username: 'sebastien',
        password: 'pwd12345',
        __v: 0,
      }
    })
  };
  let mockJwtService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, JwtService, UsersService],
    })
      .overrideProvider(UsersService).useValue(mockUserService)
      .overrideProvider(JwtService).useValue(mockJwtService)
      .compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should valide a user login/password', () => {
    const dto = {username: 'sebastien', password: 'pwd12324'};
    try {
      return expect(service.validateUser(dto.username, dto.password))
        .resolves
        .toEqual({
          _id: expect.any(Number),
          username: dto.username,
          //password: expect.any(String),
          __v: expect.any(Number),
        });
    }
    catch(e) {
      throw(e);
    }

  });    
});
