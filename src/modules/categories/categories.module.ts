import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesResolver } from './categories.resolver';
import { Category } from './entities/category.entity';

@Module({
  providers: [
    CategoriesResolver, 
    CategoriesService
  ],
  imports: [
    Category
  ]
})
export class CategoriesModule {}
