import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { AuthService } from './auth.service';
import { EmailService } from './email/email.service';
import { EmailVerifyController } from './api-rest/email-verify.controller';
import { EmailVerifyService } from './api-rest/email-verify.service';

import { PrismaModule } from '../../config/prisma/prisma.module';

import { AuthResolver } from './auth.resolver';
import { UsersModule } from '../users/users.module';
import { EmailVerifyModule } from './api-rest/email-verify.module';

@Module({
  providers: [
    AuthResolver,
    AuthService,
    EmailService,
  ],
  imports: [

    ConfigModule,

    PassportModule.register({ defaultStrategy: 'jwt' }),

    JwtModule.registerAsync({
      imports: [ ConfigModule ],
      inject: [ ConfigService ],
      useFactory: ( configService: ConfigService ) => ({ 
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: '4h'
        }
      })
    }),

    PrismaModule,
    EmailVerifyModule,
    UsersModule //* Para usar lo que tenemos en el usuario
  ]
})
export class AuthModule {}
