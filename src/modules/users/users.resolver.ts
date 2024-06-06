import { Resolver,
         Query,
         Mutation,
         Args,
         Int } from '@nestjs/graphql';

import { UsersService } from './users.service';

import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';

import { PageOptionsArgs } from '../../helpers/pagination/dto/page-options.args';
import { CustomError } from '../../helpers/errors/custom.error';

import { UserPaginationResponse } from './types/pagination-response.type';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  //? Lo manejaremos en el módulo de Auth
  // @Mutation(() => User)
  // createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
  //   return this.usersService.create(createUserInput);
  // }

  @Query(() => UserPaginationResponse, { name: 'users' })
  async findAll(
    @Args('pageOptionsArgs') pageOptionsArgs: PageOptionsArgs
  ): Promise<UserPaginationResponse> {

    throw new Error("Método no implementado");
    // return this.usersService.findAll(pageOptionsArgs);

  }

  @Query(() => User, { name: 'user' })
  async findOne(
    @Args('id', { type: () => Int }) id: number
  ): Promise<User | CustomError> {

    throw new Error("Método no implementado");
    // return this.usersService.findOne(id);

  }

  //? Lo manejaremos en el módulo de Auth
  // @Mutation(() => User)
  // updateUser(
  //   @Args('updateUserInput') updateUserInput: UpdateUserInput
  // ): Promise<User | CustomError> {

  //   throw new Error("Método no implementado");
  //   return this.usersService.update(updateUserInput.id, updateUserInput);

  // }

  @Mutation(() => User)
  blockUser(
    @Args('id', { type: () => Int }) id: number
  ): Promise<User | CustomError> {

    throw new Error("Método no implementado");
    // return this.usersService.block(id);

  }
}
