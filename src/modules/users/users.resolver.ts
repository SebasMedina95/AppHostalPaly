import { UseGuards } from '@nestjs/common';
import { Resolver,
         Query,
         Mutation,
         Args,
         Int } from '@nestjs/graphql';

import { UsersService } from './users.service';

import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/inputs/create-user.input';
import { UpdateUserInput } from './dto/inputs/update-user.input';

import { PageOptionsArgs } from '../../helpers/pagination/dto/page-options.args';
import { CustomError } from '../../helpers/errors/custom.error';
import { ValidRoles } from '../../constants/roles.enum';

import { UserPaginationResponse } from './types/pagination-response.type';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Resolver(() => User)
@UseGuards( JwtAuthGuard ) //? El JwtAuthGuard es mi Guard personalizado para GraphQL
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  //? Lo manejaremos en el módulo de Auth
  // @Mutation(() => User)
  // createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
  //   return this.usersService.create(createUserInput);
  // }

  @Query(() => UserPaginationResponse, { name: 'findAllUsers', description: "Listar todos los usuarios con filtro y paginación" })
  async findAll(
    @Args('pageOptionsArgs') pageOptionsArgs: PageOptionsArgs,
    @CurrentUser([ ValidRoles.ADMIN ]) user: User
  ): Promise<UserPaginationResponse> {

    return this.usersService.findAll(pageOptionsArgs);

  }

  //? Lo manejaremos en el módulo de Auth
  // @Mutation(() => User)
  // updateUser(
  //   @Args('updateUserInput') updateUserInput: UpdateUserInput
  // ): Promise<User | CustomError> {

  //   throw new Error("Método no implementado");
  //   return this.usersService.update(updateUserInput.id, updateUserInput);

  // }

  @Mutation(() => User, { name: 'blockUser', description: 'Bloquear un usuario' })
  blockUser(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser([ ValidRoles.ADMIN ]) user: User
  ): Promise<User | CustomError> {

    return this.usersService.block(id);

  }
}
