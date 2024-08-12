import { Mutation, Resolver } from '@nestjs/graphql';
import { SeedService } from './seed.service';

@Resolver()
export class SeedResolver {

  constructor(
    private readonly seedService: SeedService
  ) {}

  //!Vamos a desactivarlo para validar unos temas de inserción.
  // @Mutation( () => Boolean, { name: "executeSeed", description: "Ejecutar SEED para Poblar la BD" })
  // async executeSeed(): Promise<boolean> {

  //   return this.seedService.executeSeed();

  // }

}
