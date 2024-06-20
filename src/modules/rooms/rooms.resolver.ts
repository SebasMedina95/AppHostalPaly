import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { RoomsService } from './rooms.service';
import { Room } from './entities/room.entity';
import { CreateRoomInput } from './dto/create-room.input';
import { UpdateRoomInput } from './dto/update-room.input';

@Resolver(() => Room)
export class RoomsResolver {

  constructor(private readonly roomsService: RoomsService) {}

  @Mutation(() => Room, { name: 'createRoom', description: "Crear una habitación" })
  async createRoom(
    @Args('createRoomInput') createRoomInput: CreateRoomInput
  ) {

    return this.roomsService.create(createRoomInput);

  }

  @Query(() => [Room], { name: 'findAllRooms', description: "Listar habitaciones con paginación y filtro" })
  async findAll() {

    return this.roomsService.findAll();

  }

  @Query(() => Room, { name: 'findOneRoom', description: "Obtener una habitación por ID" })
  async findOne(
    @Args('id', { type: () => Int }) id: number
  ) {

    return this.roomsService.findOne(id);

  }

  @Mutation(() => Room, { name: 'updateRoom', description: "Actualizar una habitación" })
  async updateRoom(
    @Args('updateRoomInput') updateRoomInput: UpdateRoomInput
  ) {

    return this.roomsService.update(updateRoomInput.id, updateRoomInput);

  }

  @Mutation(() => Room, { name: 'removeRoom', description: "Eliminar una habitación" })
  async removeRoom(
    @Args('id', { type: () => Int }) id: number
  ) {

    return this.roomsService.remove(id);

  }
}
