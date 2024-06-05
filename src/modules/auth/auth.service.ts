import { Injectable } from '@nestjs/common';
import { CreateAuthInput } from './dto/inputs/create-auth.input';
import { UpdateAuthInput } from './dto/inputs/update-auth.input';
import { SignupInput } from './dto/inputs/signup.input';
import { AuthResponse } from './types/auth-response.type';
import { UsersService } from '../users/users.service';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {

  constructor(
      private usersService: UsersService,
      private prisma: PrismaService
  ){}

  async signup(signupInput: SignupInput): Promise<AuthResponse> {

    console.log({signupInput});
    throw new Error("No implementado");

    // return {
    //   token: "ABC123",
    //   user: new User()
    // }

  }

  
}
