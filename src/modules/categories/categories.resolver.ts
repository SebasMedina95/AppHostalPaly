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
import { PageOptionsArgs } from 'src/helpers/pagination/dto/page-options.args';
import { PageInput } from 'src/helpers/pagination/dto/page.input';
import { CategoryPaginationResponse } from './types/pagination-response.type';

@Resolver(() => Category)
export class CategoriesResolver {

  constructor(private readonly categoriesService: CategoriesService) {}

  @Mutation(() => Category, { description: "Crear una nueva categoría" })
  async createCategory(
    @Args('createCategoryInput') createCategoryInput: CreateCategoryInput
  ): Promise<Category | CustomError> {

    return this.categoriesService.create(createCategoryInput);

  }

  @Query(() => CategoryPaginationResponse, { name: 'categories', description: "Listar categorías con paginación y filtro" })
  async findAll(
    @Args('pageOptionsArgs') pageOptionsArgs: PageOptionsArgs
  ): Promise<CategoryPaginationResponse> {

    return this.categoriesService.findAll(pageOptionsArgs);

  }

  @Query(() => Category, { name: 'category', description: "Obtener categoría por ID" })
  async findOne(
    @Args('id', { type: () => Int }) id: number
  ): Promise<Category | CustomError> {

    return this.categoriesService.findOne(id);

  }

  @Mutation(() => Category, { description: "Actualizar una categoría" })
  async updateCategory(
    @Args('updateCategoryInput') updateCategoryInput: UpdateCategoryInput
  ): Promise<Category | CustomError> {

    return this.categoriesService.update(updateCategoryInput.id, updateCategoryInput);

  }

  @Mutation(() => Category, { description: "Eliminar lógicamente una categoría" })
  async removeCategory(
    @Args('id', { type: () => Int }) id: number
  ): Promise<Category | CustomError> {

    return this.categoriesService.remove(id);

  }
}
