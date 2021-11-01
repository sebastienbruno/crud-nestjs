import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../../users/users.service';
import { AuthService } from '../auth.service';
import * as bcrypt from 'bcrypt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';


describe('AuthService', () => {
  let service: AuthService;

  /*
  const bcryptCompare = jest.fn().mockResolvedValue(true);
  (bcrypt.compare as jest.Mock) = bcryptCompare;
  */
 
  let mockUserService = {
    getAll: jest.fn(() => {
      return new Array();
    }),

    findOne: jest.fn((username: string, password: string) => {
      let hash;
      if(username && username==='sebastien'){
        try {
          hash = bcrypt.hashSync('pwd12324', 10);
          return {
            _id: 1234,
            username: 'sebastien',
            password: hash,
            __v: 0,
          };
        }
        catch (e) {
          throw e;
        }
      }
      else {
        return null;
      }
    }),

    create: jest.fn((dtoCreateUser: { username: string, password: string }) => {
      let hash;
      if(dtoCreateUser.username && dtoCreateUser.password){
        try {
          const user = {
            _id: Math.random(),
            username: dtoCreateUser.username,
            password: dtoCreateUser.password,
            __v: 0,
          };
          return user;
        }
        catch (e) {
          throw e;
        }
      }
      else {
        return null;
      }
    })


  };
  let mockJwtService = {
    sign: jest.fn((payload) => {
      return 'lipsumlorem';
    })
  };

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
          __v: expect.any(Number),
        });
    }
    catch(e) {
      throw(e);
    }
  });

  it('should unvalide a unknow user login/password', () => {
    const dtoUnknowUser = {username: 'inconnu', password: 'pwd12324'};
    try {
      return expect(service.validateUser(dtoUnknowUser.username, dtoUnknowUser.password))
        .rejects
        .toThrow(UnauthorizedException);
    }
    catch(e) {
      throw(e);
    }
  });
  
  it('should unvalide a wrong password', () => {
    const dtoUnknowPassword = {username: 'sebastien', password: 'wrong_pwd'};
    try {
      return expect(service.validateUser(dtoUnknowPassword.username, dtoUnknowPassword.password))
        .rejects
        .toThrow(UnauthorizedException);
    }
    catch(e) {
      throw(e);
    }
  });

  it('should logged the user returning a access token', () => {
    const dtoUser = { username: 'sebastien', userId: 'pwd12324'};
    let access_token;
    try {
      access_token = service.login(dtoUser);
      return expect(access_token).toEqual({
        access_token: expect.any(String)
      });   
    }
    catch(e) {
      throw e;
    }
  });

  it('should register a new user', () => {
    expect.assertions(1);
    const dtoCreateUser = { username: 'patricia', password: 'passwordpatricia' };
    try {
      return expect(service.register(dtoCreateUser))
        .resolves
        .toEqual({
          _id: expect.any(Number),
          username: dtoCreateUser.username,
          password: expect.any(String),
          __v: 0,
        });
    }
    catch(e){
      throw e;
    }

  });

  it('should not register a user already known', () => {
    expect.assertions(1);
    const dtoCreateUser = { username: 'sebastien', password: 'passwordsebastien' };
    try {
      return expect(service.register(dtoCreateUser))
        .rejects
        .toThrow(ConflictException);
    }
    catch(e){
      throw e;
    }

  });

  it('should return a list of users', () => {
    expect.assertions(1);
    try {
      return expect(service.getAllUsers())
        .resolves
        .toBeDefined
    }
    catch(e) {
      throw e;
    }
  });
});
