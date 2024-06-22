import { Resolver,
         Query,
         Mutation,
         Args,
         Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { RoomsService } from './rooms.service';
import { Room } from './entities/room.entity';
import { User } from '../users/entities/user.entity';

import { CreateRoomInput } from './dto/inputs/create-room.input';
import { UpdateRoomInput } from './dto/inputs/update-room.input';

import { RoomResponse } from './types/create-update-response.type';
import { RoomPaginationResponse } from './types/pagination-response.type';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

import { ValidRoles } from '../../constants/roles.enum';
import { PageOptionsArgs } from '../../helpers/pagination/dto/page-options.args';
import { CustomError } from '../../helpers/errors/custom.error';

@Resolver(() => Room)
@UseGuards( JwtAuthGuard ) //? El JwtAuthGuard es mi Guard personalizado para GraphQL
export class RoomsResolver {

  constructor(private readonly roomsService: RoomsService) {}

  @Mutation(() => RoomResponse, { name: 'createRoom', description: "Crear una habitación" })
  async createRoom(
    @Args('createRoomInput') createRoomInput: CreateRoomInput,
    @CurrentUser([ ValidRoles.EMPLOYEE_NV1, ValidRoles.ADMIN ]) user: User
  ): Promise<RoomResponse | CustomError> {

    return this.roomsService.create(createRoomInput, user);

  }

  @Query(() => RoomPaginationResponse, { name: 'findAllRooms', description: "Listar habitaciones con paginación y filtro" })
  async findAll(
    @Args('pageOptionsArgs') pageOptionsArgs: PageOptionsArgs,
    @CurrentUser([ ValidRoles.EMPLOYEE_NV1, ValidRoles.ADMIN ]) user: User
  ): Promise<RoomPaginationResponse> {

    return this.roomsService.findAll(pageOptionsArgs);

  }

  @Query(() => Room, { name: 'findOneRoom', description: "Obtener una habitación por ID" })
  async findOne(
    @Args('id', { type: () => Int }) id: number
  ): Promise<Room | CustomError> {

    return this.roomsService.findOne(id);

  }

  @Mutation(() => Room, { name: 'updateRoom', description: "Actualizar una habitación" })
  async updateRoom(
    @Args('updateRoomInput') updateRoomInput: UpdateRoomInput,
    @CurrentUser([ ValidRoles.EMPLOYEE_NV1, ValidRoles.ADMIN ]) user: User
  ): Promise<Room | CustomError> {

    return this.roomsService.update(updateRoomInput.id, updateRoomInput, user);

  }

  @Mutation(() => Room, { name: 'removeRoom', description: "Eliminar una habitación" })
  async removeRoom(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser([ ValidRoles.EMPLOYEE_NV1, ValidRoles.ADMIN ]) user: User
  ): Promise<Room | CustomError> {

    return this.roomsService.remove(id, user);

  }

  @Query(() => [Room], { name: 'findRoomsByCategory', description: "Obtener habitaciones por categoría" })
  async findByCategory(
    @Args('id', { type: () => Int }) id: number
  ): Promise<Room[] | CustomError> {

    return this.roomsService.findByCategory(id);

  }

}
