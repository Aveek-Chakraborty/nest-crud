import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from "./dto/auth.dto";
import { AuthlogDto } from './dto/authlog.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() createAuthDto: AuthDto) {
    return this.authService.signup(createAuthDto);
  }

  @Post('Login')
  login(@Body() createAuthDto: AuthlogDto){
    return this.authService.login(createAuthDto);
  }


  
}
