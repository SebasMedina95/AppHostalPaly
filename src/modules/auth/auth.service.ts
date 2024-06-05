import { Injectable, Logger } from '@nestjs/common';
import { CreateAuthInput } from './dto/inputs/create-auth.input';
import { UpdateAuthInput } from './dto/inputs/update-auth.input';
import { SignupInput } from './dto/inputs/signup.input';

import { AuthResponse } from './types/auth-response.type';
import { CustomError } from '../../helpers/errors/custom.error';

import { UsersService } from '../users/users.service';
import { PrismaService } from '../../config/prisma/prisma.service';
import { EmailService } from './email/email.service';

import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {

  constructor(
      private usersService: UsersService,
      private readonly emailService: EmailService,
      private prisma: PrismaService
  ){}

  async signup(signupInput: SignupInput): Promise<AuthResponse | CustomError> {

    const logger = new Logger('AuthService - signup')

    try {

      //* Paso 1. Creo el usuario
      const user = await this.usersService.create(signupInput);

      //* Paso 2. Envío el Email de confirmación
      await this.emailService.sendEmailValidationUser();

      //* Paso 3. Genero token (Podría ser opcional, tendrá más sentido en el Login)
      //TODO ...


      return {
        user,
        token: "ABC123",
      }
      
    } catch (error) {

      logger.log(`Ocurrió un error al intentar crear el usuario: ${error}`);
      throw CustomError.internalServerError(`${error}`);
      
    }

  }

  
}
