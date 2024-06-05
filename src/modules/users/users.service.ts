import { BadRequestException, Injectable, Logger } from '@nestjs/common';

import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { SignupInput } from '../auth/dto/inputs/signup.input';

import { PageOptionsArgs } from '../../helpers/pagination/dto/page-options.args';
import { UserPaginationResponse } from './types/pagination-response.type';
import { CustomError } from '../../helpers/errors/custom.error';

import { User } from './entities/user.entity';

import { PrismaService } from '../../config/prisma/prisma.service';

@Injectable()
export class UsersService {

  constructor(
    private prisma: PrismaService
  ){}

  //? ************************************ ?//
  //? ***** Lo llamaremos desde Auth ***** ?//
  //? ************************************ ?//
  async create(signupInput: SignupInput): Promise<User | CustomError> {

    const logger = new Logger('UsersService llamando a AuthService - create')

    try {
      
      const existUser = await this.prisma.tBL_USERS.findMany({
        where: { email : signupInput.email }
      })

      if( existUser.length > 0 ) 
        return CustomError.badRequestError("Ya existe un usuario con este email");

      if( signupInput.password != signupInput.passwordConfirm )
        return CustomError.badRequestError("Las contraseñas no coinciden");

      const newUser = await this.prisma.tBL_USERS.create({
        data: {
          names: signupInput.names,
          lastnames: signupInput.lastnames,
          email: signupInput.email,
          password: signupInput.password,
          gender: signupInput.gender,
          img: signupInput.img,
          phone1: signupInput.phone1,
          phone2: signupInput.phone2,
        }
      })

      return newUser;

    } catch (error) {

      logger.log(`Ocurrió un error al intentar crear el usuario: ${error}`);
      throw CustomError.internalServerError(`${error}`);
      
    } finally {
      
      logger.log(`Creación de usuario finalizada`);
      await this.prisma.$disconnect();

    }

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
