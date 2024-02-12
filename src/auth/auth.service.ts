import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { AuthlogDto } from './dto/authlog.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/auth.entity';
import { Repository } from 'typeorm';
import * as argon from "argon2";
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private jwt: JwtService,
    private config: ConfigService
  ) { }



  async signup(createAuthDto: AuthDto): Promise<{ message: string; newUser: User; token:string}> {
    try {
      const { email, password, firstName, lastName } = createAuthDto;

      const hash = await argon.hash(password);


      const existingUser = await this.userRepository.findOne({ where: { email } });
      if (existingUser) {
        throw new ConflictException('User already exists');
      }


      const newUser = this.userRepository.create({
        email,
        hash,
        firstName,
        lastName,
      });

      await this.userRepository.save(newUser);


      delete newUser.hash;

      const token = await this.signToken(newUser.id, newUser.email);

      return { message: "Signup successful", newUser , token};
    } catch (error) {
      throw error;
    }
  }



  async login(createAuthDto: AuthlogDto): Promise<{ message: string; user: User ,token:string}> {
    try {
      const { email, password } = createAuthDto;

      const user = await this.userRepository.findOne({ where: { email } });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const passwordMatch = await argon.verify(user.hash, password);
      if (!passwordMatch) {
        throw new UnauthorizedException('Invalid credentials');
      }

      delete user.hash;

      const token = await this.signToken(user.id, user.email);

      return { message: "Login successful", user , token};
    } catch (error) {
      throw error;
    }
  }



  async signToken(userId: number, email: string) :Promise<string> {
    const payload = {
      sub: userId,
      email
    }

    return this.jwt.signAsync(payload, {
      expiresIn: '60m',
      secret: this.config.get('JWT_SECRET')
    })
  }

  async validateUser(payload: { userId: number; email: string }): Promise<User | null> {
    const { userId, email } = payload;

    const user = await this.userRepository.findOne({ where: { id: userId, email: email } });

    if (!user) {
        return null;
    }

    return user;
}



}
