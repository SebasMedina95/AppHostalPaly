import { Module } from '@nestjs/common';

import { PrismaModule } from '../../config/prisma/prisma.module';
import { CategoriesModule } from '../categories/categories.module';

import { RoomsService } from './rooms.service';
import { RoomsResolver } from './rooms.resolver';

import { Category } from '../categories/entities/category.entity';
import { Room } from './entities/room.entity';

@Module({
  providers: [
    RoomsResolver, 
    RoomsService
  ],
  imports: [
    PrismaModule,
    CategoriesModule,
    Category,
    Room
  ],
  exports: [
    RoomsService
  ]
})
export class RoomsModule {}
