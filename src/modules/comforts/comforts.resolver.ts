import { UseGuards } from '@nestjs/common';
import { Resolver,
         Query,
         Mutation,
         Args,
         Int } from '@nestjs/graphql';

import { ComfortsService } from './comforts.service';

import { Comfort } from './entities/comfort.entity';
import { User } from '../users/entities/user.entity';

import { CreateComfortInput } from './dto/inputs/create-comfort.input';
import { UpdateComfortInput } from './dto/inputs/update-comfort.input';

import { CustomError } from '../../helpers/errors/custom.error';
import { PageOptionsArgs } from '../../helpers/pagination/dto/page-options.args';

import { ComfortPaginationResponse } from './types/pagination-response.type';
import { ValidRoles } from '../../constants/roles.enum';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';


@Resolver(() => Comfort)
@UseGuards( JwtAuthGuard ) //? El JwtAuthGuard es mi Guard personalizado para GraphQL
export class ComfortsResolver {

  constructor(private readonly comfortsService: ComfortsService) {}

  @Mutation(() => Comfort, { name: 'createComfort', description: "Crear una nueva comodidad" })
  async createComfort(
    @Args('createComfortInput') createComfortInput: CreateComfortInput,
    @CurrentUser([ ValidRoles.EMPLOYEE_NV1, ValidRoles.ADMIN ]) user: User
  ): Promise<Comfort | CustomError> {

    return this.comfortsService.create(createComfortInput, user);

  }

  @Query(() => ComfortPaginationResponse, { name: 'findAllComforts', description: "Listar comodidades con paginación y filtro" })
  async findAll(
    @Args('pageOptionsArgs') pageOptionsArgs: PageOptionsArgs,
    @CurrentUser([ ValidRoles.EMPLOYEE_NV1, ValidRoles.ADMIN ]) user: User
  ): Promise<ComfortPaginationResponse> {

    return this.comfortsService.findAll(pageOptionsArgs);

  }

  @Query(() => Comfort, { name: 'findOneComfort', description: "Obtener comodidad por ID" })
  async findOne(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser([ ValidRoles.EMPLOYEE_NV1, ValidRoles.ADMIN ]) user: User
  ): Promise<Comfort | CustomError> {

    return this.comfortsService.findOne(id);

  }

  @Mutation(() => Comfort, { name: 'updateComfort', description: "Actualizar una comodidad" })
  async updateComfort(
    @Args('updateComfortInput') updateComfortInput: UpdateComfortInput,
    @CurrentUser([ ValidRoles.EMPLOYEE_NV1, ValidRoles.ADMIN ]) user: User
  ): Promise<Comfort | CustomError> {

    return this.comfortsService.update(updateComfortInput.id, updateComfortInput, user);

  }

  @Mutation(() => Comfort, { name: 'removeComfort', description: "Eliminar lógicamente una comodidad" })
  async removeComfort(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser([ ValidRoles.EMPLOYEE_NV1, ValidRoles.ADMIN ]) user: User
  ): Promise<Comfort | CustomError> {

    return this.comfortsService.remove(id, user);

  }
}
