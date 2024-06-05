import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { PrismaModule } from 'src/config/prisma/prisma.module';
import { User } from './entities/user.entity';

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
    UsersService,
    User
  ]
})
export class UsersModule {}
