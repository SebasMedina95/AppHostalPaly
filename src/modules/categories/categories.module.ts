import { Module } from '@nestjs/common';

import { PrismaModule } from '../../config/prisma/prisma.module';

import { Category } from './entities/category.entity';
import { ComfortsForCategory } from './entities/comforts-of-category.entity';

import { CategoriesService } from './categories.service';
import { CategoriesResolver } from './categories.resolver';
import { AuthModule } from '../auth/auth.module';

@Module({
  providers: [
    CategoriesResolver, 
    CategoriesService
  ],
  imports: [
    AuthModule,
    PrismaModule,
    Category,
    ComfortsForCategory
  ],
  exports: [
    CategoriesService
  ]
})
export class CategoriesModule {}
