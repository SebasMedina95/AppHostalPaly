import { BadRequestException,
         Injectable,
         Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { CreateUserInput } from './dto/inputs/create-user.input';
import { UpdateUserInput } from './dto/inputs/update-user.input';
import { SignupInput } from '../auth/dto/inputs/signup.input';

import { PageOptionsArgs } from '../../helpers/pagination/dto/page-options.args';
import { UserPaginationResponse } from './types/pagination-response.type';
import { CustomError } from '../../helpers/errors/custom.error';

import { User } from './entities/user.entity';

import { PrismaService } from '../../config/prisma/prisma.service';
import { PageMetaInput } from 'src/helpers/pagination/dto/page-meta.input';
import { PageInput } from 'src/helpers/pagination/dto/page.input';
import { UpdateAuthInput } from '../auth/dto/inputs/update-auth.input';

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
          password: bcrypt.hashSync( signupInput.password, 10 ),
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
    let getUsers: User[] = [];
    let itemCount: number = 0;

    try {

      if( search && search !== "" && search !== null && search !== undefined  ){

        getUsers = await this.prisma.tBL_USERS.findMany({
          take,
          skip: Number(page - 1) * take,
          where: {
              OR: [
                  { names: { contains: search, mode: 'insensitive' } },
                  { lastnames: { contains: search, mode: 'insensitive' } },
                  { email: { contains: search, mode: 'insensitive' } },
                  { phone1: { contains: search, mode: 'insensitive' } },
                  { phone2: { contains: search, mode: 'insensitive' } },
                  { roles: { has: search } }
              ],
              AND: [
                  { isBlock: false }
              ]
          },
          orderBy: { id: order }
        });

        itemCount = await this.prisma.tBL_USERS.count({
          where: {
            OR: [
                { names: { contains: search, mode: 'insensitive' } },
                { lastnames: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
                { phone1: { contains: search, mode: 'insensitive' } },
                { phone2: { contains: search, mode: 'insensitive' } },
                { roles: { has: search } }
            ],
            AND: [
                { isBlock: false }
            ]
          },
        });

      }else{

        getUsers = await this.prisma.tBL_USERS.findMany({
          take,
          skip: Number(page - 1) * take,
          where: {  isBlock: false },
          orderBy: { id: order }
        });

        itemCount = await this.prisma.tBL_USERS.count({
          where: { isBlock: false },
        });

      }

      const pageMetaDto = new PageMetaInput({ itemCount, pageOptionsArgs });
      const finalResult = new PageInput(getUsers, pageMetaDto)

      return {
        data: getUsers,
        meta: pageMetaDto
      };
      
    } catch (error) {

      logger.log(`Ocurrió un error al intentar obtener listado de usuarios: ${error}`);
      throw CustomError.internalServerError(`${error}`);
      
    } finally {
      
      logger.log(`Listado de usuarios finalizada`);
      await this.prisma.$disconnect();

    }

  }

  async findOneById(id: number): Promise<User | CustomError> {
    
    const logger = new Logger('UsersService - findOneByEmail')
    
    try {

      const getUser = await this.prisma.tBL_USERS.findFirst({
        where: { id }
      });

      return getUser;
      
    } catch (error) {

      logger.log(`Ocurrió un error al intentar obtener el usuario: ${error}`);
      throw CustomError.internalServerError(`${error}`);
      
    } finally {
      
      logger.log(`Obtención de usuario por ID finalizado`);
      await this.prisma.$disconnect();

    }
    
  }

  async findOneByEmail(email: string): Promise<User | CustomError> {

    const logger = new Logger('UsersService - findOneByEmail')
    
    try {

      const getUser = await this.prisma.tBL_USERS.findFirst({
        where: { email }
      });

      return getUser;
      
    } catch (error) {

      logger.log(`Ocurrió un error al intentar obtener el usuario: ${error}`);
      throw CustomError.internalServerError(`${error}`);
      
    } finally {
      
      logger.log(`Obtención de usuario por ID finalizado`);
      await this.prisma.$disconnect();

    }
    
  }

  //? Lo llamaremos desde Auth
  //? Nos apoyaremos para actualizar el password
  //? Nos apoyaremos para actualizar el avatar
  async updateFieldsSimple(user: User, updateUserInput: UpdateAuthInput): Promise<User | CustomError> {

    const logger = new Logger('UsersService - updateFieldsSimple')

    try {

      //1. Verificamos existencia del usuario
      const getUser = await this.prisma.tBL_USERS.findFirst({
        where: {
          AND: [
            { id: user.id },
            { isBlock: false }
          ]
        }
      })

      if( !getUser )
        throw CustomError.badRequestError(`No se encontró el usuario o se encuentra bloqueado para actualizar.`);

      //2. El usuario solo puede actualizar su propia información a menos de que sea ADMIN.
      if( user.id != updateUserInput.id ){
        if( !user.roles.includes("ADMIN") ){
          throw CustomError.badRequestError(`No puede actualizar la información de un usuario diferente al logeado actualmente, a menos que sea ADMIN.`);
        }
      }

      //3. Actualización
      const updateUser = await this.prisma.tBL_USERS.update({
        where: { id: updateUserInput.id },
        data: { ...updateUserInput }
      })

      return updateUser;
      
    } catch (error) {

      logger.log(`Ocurrió un error al intentar actualizar el usuario: ${error}`);
      throw CustomError.internalServerError(`${error}`);
      
    } finally {
      
      logger.log(`Actualización de usuario finalizado`);
      await this.prisma.$disconnect();

    }

  }

  async block(id: number): Promise<User | CustomError> {

    const logger = new Logger('UsersService - block')
    
    try {

      //Verificación del ID
      const existUser = await this.prisma.tBL_USERS.findFirst({
        where: { id }
      });

      if( existUser == null ) return CustomError.notFoundError(`No se encontró usuario con el ID ${id}`);

      const blockUser = await this.prisma.tBL_USERS.update({
        where: { id },
        data: {
          isBlock: true,
          userWhoBlock: "123456789",
        }
      });

      return blockUser;
      
    } catch (error) {

      logger.log(`Ocurrió un error al intentar obtener el usuario: ${error}`);
      throw CustomError.internalServerError(`${error}`);
      
    } finally {
      
      logger.log(`Obtención de usuario por ID finalizado`);
      await this.prisma.$disconnect();

    }
    
  }

  //******************************TODO ******************************
  async updatePassword(){}

  //******************************TODO ******************************
  async updateImg(){}

  //******************************TODO ******************************
  async recoveryPassword(){}

}
