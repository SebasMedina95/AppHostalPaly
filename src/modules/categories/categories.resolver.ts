import { UseGuards } from '@nestjs/common';
import { Resolver,
         Query,
         Mutation,
         Args,
         Int } from '@nestjs/graphql';
import { CategoriesService } from './categories.service';

import { Category } from './entities/category.entity';
import { User } from '../users/entities/user.entity';

import { CreateCategoryInput } from './dto/inputs/create-category.input';
import { UpdateCategoryInput } from './dto/inputs/update-category.input';

import { CustomError } from '../../helpers/errors/custom.error';
import { PageOptionsArgs } from '../../helpers/pagination/dto/page-options.args';
import { ValidRoles } from '../../constants/roles.enum';

import { CategoryPaginationResponse } from './types/pagination-response.type';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Resolver(() => Category)
@UseGuards( JwtAuthGuard ) //? El JwtAuthGuard es mi Guard personalizado para GraphQL
export class CategoriesResolver {

  constructor(private readonly categoriesService: CategoriesService) {}

  @Mutation(() => Category, { description: "Crear una nueva categoría" })
  async createCategory(
    @Args('createCategoryInput') createCategoryInput: CreateCategoryInput,
    @CurrentUser([ ValidRoles.EMPLOYEE_NV1, ValidRoles.ADMIN ]) user: User
  ): Promise<Category | CustomError> {

    return this.categoriesService.create(createCategoryInput, user);

  }

  @Query(() => CategoryPaginationResponse, { name: 'categories', description: "Listar categorías con paginación y filtro" })
  async findAll(
    @Args('pageOptionsArgs') pageOptionsArgs: PageOptionsArgs,
    @CurrentUser([ ValidRoles.EMPLOYEE_NV1, ValidRoles.ADMIN ]) user: User
  ): Promise<CategoryPaginationResponse> {

    return this.categoriesService.findAll(pageOptionsArgs);

  }

  @Query(() => Category, { name: 'category', description: "Obtener categoría por ID" })
  async findOne(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser([ ValidRoles.EMPLOYEE_NV1, ValidRoles.ADMIN ]) user: User
  ): Promise<Category | CustomError> {

    return this.categoriesService.findOne(id);

  }

  @Mutation(() => Category, { description: "Actualizar una categoría" })
  async updateCategory(
    @Args('updateCategoryInput') updateCategoryInput: UpdateCategoryInput,
    @CurrentUser([ ValidRoles.EMPLOYEE_NV1, ValidRoles.ADMIN ]) user: User
  ): Promise<Category | CustomError> {

    return this.categoriesService.update(updateCategoryInput.id, updateCategoryInput, user);

  }

  @Mutation(() => Category, { description: "Eliminar lógicamente una categoría" })
  async removeCategory(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser([ ValidRoles.EMPLOYEE_NV1, ValidRoles.ADMIN ]) user: User
  ): Promise<Category | CustomError> {

    return this.categoriesService.remove(id, user);

  }
}
