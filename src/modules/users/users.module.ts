import { Module } from '@nestjs/common';

import { PrismaModule } from '../../config/prisma/prisma.module';

import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';

@Module({
  providers: [
    UsersResolver, 
    UsersService
  ],
  imports: [
    PrismaModule,
    User
  ],
  exports: [
    UsersService, //* Para usarlo en el Auth
    User
  ]
})
export class UsersModule {}
