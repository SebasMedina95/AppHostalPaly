import { Injectable, Logger } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { PageOptionsArgs } from 'src/helpers/pagination/dto/page-options.args';
import { UserPaginationResponse } from './types/pagination-response.type';
import { User } from './entities/user.entity';
import { CustomError } from 'src/helpers/errors/custom.error';
import { PrismaService } from 'src/config/prisma/prisma.service';

@Injectable()
export class UsersService {

  constructor(
    private prisma: PrismaService
  ){}

  //? Lo llamaremos desde Auth
  create(createUserInput: CreateUserInput) {
    return 'This action adds a new user';
  }


  async findAll(
    pageOptionsArgs: PageOptionsArgs
  ): Promise<UserPaginationResponse> {

    const logger = new Logger('UsersService - findAll')
    const { take, page, search, order } = pageOptionsArgs;
    let getCategories: User[] = [];
    let itemCount: number = 0;

    try {

      if( search && search !== "" && search !== null && search !== undefined  ){

        //TODO

      }

      return null;
      
    } catch (error) {

      logger.log(`Ocurrió un error al intentar obtener listado de categorías: ${error}`);
      throw CustomError.internalServerError(`${error}`);
      
    } finally {
      
      logger.log(`Listado de categorías finalizada`);
      await this.prisma.$disconnect();

    }

  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  //? Lo llamaremos desde Auth
  update(id: number, updateUserInput: UpdateUserInput) {
    return `This action updates a #${id} user`;
  }

  block(id: number) {
    return `This action removes a #${id} user`;
  }
}
