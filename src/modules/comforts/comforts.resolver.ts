import { Resolver,
         Query,
         Mutation,
         Args,
         Int } from '@nestjs/graphql';
import { ComfortsService } from './comforts.service';
import { Comfort } from './entities/comfort.entity';
import { CreateComfortInput } from './dto/inputs/create-comfort.input';
import { UpdateComfortInput } from './dto/inputs/update-comfort.input';
import { CustomError } from 'src/helpers/errors/custom.error';
import { PageOptionsArgs } from 'src/helpers/pagination/dto/page-options.args';
import { ComfortPaginationResponse } from './types/pagination-response.type';

@Resolver(() => Comfort)
export class ComfortsResolver {

  constructor(private readonly comfortsService: ComfortsService) {}

  @Mutation(() => Comfort, { description: "Crear una nueva comodidad" })
  async createComfort(
    @Args('createComfortInput') createComfortInput: CreateComfortInput
  ): Promise<Comfort | CustomError> {

    return this.comfortsService.create(createComfortInput);

  }

  @Query(() => ComfortPaginationResponse, { name: 'comforts', description: "Listar comodidades con paginación y filtro" })
  async findAll(
    @Args('pageOptionsArgs') pageOptionsArgs: PageOptionsArgs
  ): Promise<ComfortPaginationResponse> {

    return this.comfortsService.findAll(pageOptionsArgs);

  }

  @Query(() => Comfort, { name: 'comfort', description: "Obtener comodidad por ID" })
  async findOne(
    @Args('id', { type: () => Int }) id: number
  ): Promise<Comfort | CustomError> {

    return this.comfortsService.findOne(id);

  }

  @Mutation(() => Comfort, { description: "Actualizar una comodidad" })
  async updateComfort(
    @Args('updateComfortInput') updateComfortInput: UpdateComfortInput
  ): Promise<Comfort | CustomError> {

    return this.comfortsService.update(updateComfortInput.id, updateComfortInput);

  }

  @Mutation(() => Comfort, { description: "Eliminar lógicamente una comodidad" })
  async removeComfort(
    @Args('id', { type: () => Int }) id: number
  ): Promise<Comfort | CustomError> {

    return this.comfortsService.remove(id);

  }
}
