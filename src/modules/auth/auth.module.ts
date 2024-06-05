import { Module } from '@nestjs/common';

import { AuthService } from './auth.service';
import { EmailService } from './email/email.service';
import { PrismaModule } from '../../config/prisma/prisma.module';

import { AuthResolver } from './auth.resolver';
import { UsersModule } from '../users/users.module';

@Module({
  providers: [
    AuthResolver, 
    AuthService,
    EmailService
  ],
  imports: [
    PrismaModule,
    UsersModule //* Para usar lo que tenemos en el usuario
  ]
})
export class AuthModule {}
