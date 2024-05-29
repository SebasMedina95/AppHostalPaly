import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ComfortsService } from './comforts.service';
import { Comfort } from './entities/comfort.entity';
import { CreateComfortInput } from './dto/create-comfort.input';
import { UpdateComfortInput } from './dto/update-comfort.input';

@Resolver(() => Comfort)
export class ComfortsResolver {
  constructor(private readonly comfortsService: ComfortsService) {}

  @Mutation(() => Comfort)
  createComfort(@Args('createComfortInput') createComfortInput: CreateComfortInput) {
    return this.comfortsService.create(createComfortInput);
  }

  @Query(() => [Comfort], { name: 'comforts' })
  findAll() {
    return this.comfortsService.findAll();
  }

  @Query(() => Comfort, { name: 'comfort' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.comfortsService.findOne(id);
  }

  @Mutation(() => Comfort)
  updateComfort(@Args('updateComfortInput') updateComfortInput: UpdateComfortInput) {
    return this.comfortsService.update(updateComfortInput.id, updateComfortInput);
  }

  @Mutation(() => Comfort)
  removeComfort(@Args('id', { type: () => Int }) id: number) {
    return this.comfortsService.remove(id);
  }
}
