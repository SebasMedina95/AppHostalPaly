import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { UsersModule } from '../users/users.module';
import { PrismaModule } from 'src/config/prisma/prisma.module';

@Module({
  providers: [
    AuthResolver, 
    AuthService
  ],
  imports: [
    PrismaModule,
    UsersModule
  ]
})
export class AuthModule {}
