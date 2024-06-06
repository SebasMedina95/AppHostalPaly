import { Module } from '@nestjs/common';

import { PrismaModule } from '../../config/prisma/prisma.module';

import { Category } from './entities/category.entity';
import { CategoriesService } from './categories.service';
import { CategoriesResolver } from './categories.resolver';

@Module({
  providers: [
    CategoriesResolver, 
    CategoriesService
  ],
  imports: [
    PrismaModule,
    Category
  ]
})
export class CategoriesModule {}
