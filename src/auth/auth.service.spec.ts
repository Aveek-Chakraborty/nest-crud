import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/auth.entity';
import { Repository } from 'typeorm';
import { AuthDto } from './dto/auth.dto';
import { AuthlogDto } from './dto/authlog.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import {  ConflictException, NotFoundException} from '@nestjs/common';
import * as argon from 'argon2';


class MockUserRepository extends Repository<User> {

  findOne(_: any): any { }
  save(_: any): any { }

}

class MockJwtService {
  signAsync(payload: any): Promise<string> {
    return Promise.resolve('mocked_jwt_token');
  }
}


class MockConfigService {
  get(key: string): string {
    return 'mocked_secret';
  }
}

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: MockUserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useClass: MockUserRepository,
        },
        {
          provide: JwtService,
          useClass: MockJwtService,
        },
        {
          provide: ConfigService,
          useClass: MockConfigService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signup', () => {
    it('should create a new user', async () => {
      const createUserDto: AuthDto = {
        email: 'test@example.com',
        password: 'password',
        firstName: 'John',
        lastName: 'Doe',
      };

      const newUser: User = {
        id: 1,
        email: createUserDto.email,
        hash: 'hashed_password', 
        firstName: createUserDto.firstName,
        lastName: createUserDto.lastName,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      userRepository.findOne = jest.fn().mockResolvedValueOnce(null);
      userRepository.create = jest.fn().mockReturnValueOnce(newUser);
      userRepository.save = jest.fn().mockResolvedValueOnce(newUser);

      const result = await service.signup(createUserDto);

      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { email: createUserDto.email } });
      expect(userRepository.create).toHaveBeenCalledWith({
        email: createUserDto.email,
        hash: expect.any(String), 
        firstName: createUserDto.firstName,
        lastName: createUserDto.lastName,
      });
      expect(userRepository.save).toHaveBeenCalledWith(newUser);
      expect(result).toEqual(expect.objectContaining({
        message: 'Signup successful',
        newUser,
        token: 'mocked_jwt_token',
      }));
    });

    it('should throw ConflictException if user already exists', async () => {
      userRepository.findOne = jest.fn().mockResolvedValueOnce({});

      
      const createUserDto: AuthDto = {
        email: 'test@example.com',
        password: 'password', 
        firstName: 'John',
        lastName: 'Doe',
      };

      await expect(service.signup(createUserDto)).rejects.toThrow(ConflictException);
    });

  });








  describe('login', () => {
    it('should log in a user with valid credentials', async () => {
      const loginUserDto: AuthlogDto = {
        email: 'test@example.com',
        password: 'password',
      };
    

      const hashedPassword = await argon.hash(loginUserDto.password);

      const existingUser: User = {
        id: 1,
        email: loginUserDto.email,
        hash: hashedPassword, 
        firstName: 'John',
        lastName: 'Doe',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    
      userRepository.findOne = jest.fn().mockResolvedValueOnce(existingUser);
    
      const verifySpy = jest.spyOn(argon, 'verify').mockResolvedValueOnce(true);

      const result = await service.login(loginUserDto);
    
      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { email: loginUserDto.email } });
    
      expect(verifySpy).toHaveBeenCalledWith(hashedPassword, loginUserDto.password);
    
      expect(result).toEqual({
        message: 'Login successful',
        user: existingUser,
        token: 'mocked_jwt_token',
      });
    });
    


    it('should throw NotFoundException if user does not exist', async () => {
      const loginUserDto: AuthlogDto = {
        email: 'nonexistent@example.com',
        password: 'password',
      };

      userRepository.findOne = jest.fn().mockResolvedValueOnce(null);

      await expect(service.login(loginUserDto)).rejects.toThrow(NotFoundException);
    });
  });
});
