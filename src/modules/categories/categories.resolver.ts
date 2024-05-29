import { Resolver,
         Query,
         Mutation,
         Args,
         Int, 
         ID} from '@nestjs/graphql';
import { CategoriesService } from './categories.service';
import { Category } from './entities/category.entity';

import { CreateCategoryInput } from './dto/inputs/create-category.input';
import { UpdateCategoryInput } from './dto/inputs/update-category.input';
import { CustomError } from 'src/helpers/errors/custom.error';

@Resolver(() => Category)
export class CategoriesResolver {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Mutation(() => Category)
  async createCategory(
    @Args('createCategoryInput') createCategoryInput: CreateCategoryInput
  ): Promise<Category | CustomError> {

    return this.categoriesService.create(createCategoryInput);

  }

  @Query(() => [Category], { name: 'categories' })
  async findAll(): Promise<Category[] | CustomError> {

    return this.categoriesService.findAll();

  }

  @Query(() => Category, { name: 'category' })
  async findOne(
    @Args('id', { type: () => Int }) id: number
  ): Promise<Category | CustomError> {

    return this.categoriesService.findOne(id);

  }

  @Mutation(() => Category)
  async updateCategory(
    @Args('updateCategoryInput') updateCategoryInput: UpdateCategoryInput
  ): Promise<Category | CustomError> {

    return this.categoriesService.update(updateCategoryInput.id, updateCategoryInput);

  }

  @Mutation(() => Category)
  async removeCategory(
    @Args('id', { type: () => Int }) id: number
  ): Promise<Category | CustomError> {

    return this.categoriesService.remove(id);

  }
}
