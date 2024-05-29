import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesResolver } from './categories.resolver';
import { Category } from './entities/category.entity';
import { PrismaModule } from 'src/config/prisma/prisma.module';

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
