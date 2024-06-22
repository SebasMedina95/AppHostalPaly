import { Injectable, Logger } from '@nestjs/common';

import { PrismaService } from 'src/config/prisma/prisma.service';

import { Comfort } from './entities/comfort.entity';
import { User } from '../users/entities/user.entity';
import { CreateComfortInput } from './dto/inputs/create-comfort.input';
import { UpdateComfortInput } from './dto/inputs/update-comfort.input';

import { CustomError } from '../../helpers/errors/custom.error';
import { PageOptionsArgs } from '../../helpers/pagination/dto/page-options.args';
import { PageMetaInput } from '../../helpers/pagination/dto/page-meta.input';
import { PageInput } from '../../helpers/pagination/dto/page.input';

import { ComfortPaginationResponse } from './types/pagination-response.type';

@Injectable()
export class ComfortsService {

  constructor(
    private prisma: PrismaService
  ){}


  async create(createComfortInput: CreateComfortInput, user: User) {
    
    const logger = new Logger('ComfortsService - create');
    const { name, description } = createComfortInput;

    try {

      const existComfort = await this.prisma.tBL_COMFORTS.findMany({
        where: {
          OR: [
            { name },
            { description }
          ]
        }
      })

      if( existComfort.length > 0 ) return CustomError.badRequestError("Ya existe el nombre de comodidad y/o la descripción");
      
      const newComfort = await this.prisma.tBL_COMFORTS.create({
        data: {
          name,
          description,
          userCreateAt: user.email,
          createDateAt: new Date(),
          userUpdateAt: user.email,
          updateDateAt: new Date(),
        }
      });

      return newComfort;

    } catch (error) {

      logger.log(`Ocurrió un error al intentar crear la comodidad: ${error}`);
      throw CustomError.internalServerError(`${error}`);
      
    } finally {
      
      logger.log(`Creación de comodidad finalizada`);
      await this.prisma.$disconnect();

    }
    
  }

  async findAll(
    pageOptionsArgs: PageOptionsArgs
  ): Promise<ComfortPaginationResponse> {
    
    const logger = new Logger('ComfortsService - findAll')
    const { take, page, search, order } = pageOptionsArgs;
    let getComforts: Comfort[] = [];
    let itemCount: number = 0;

    try {

      if( search && search !== "" && search !== null && search !== undefined  ){

        getComforts = await this.prisma.tBL_COMFORTS.findMany({
          take,
          skip: Number(page - 1) * take,
          where: {
              OR: [
                  { name: { contains: search, mode: 'insensitive' } },
                  { description: { contains: search, mode: 'insensitive' } },
              ],
              AND: [
                  { status: true }
              ]
          },
          orderBy: { id: order }
        });

        itemCount = await this.prisma.tBL_COMFORTS.count({
          where: {
            OR: [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ],
            AND: [
                { status: true }
            ]
          },
        });

      }else{

        getComforts = await this.prisma.tBL_COMFORTS.findMany({
          take,
          skip: Number(page - 1) * take,
          where: {  status: true },
          orderBy: { id: order }
        });

        itemCount = await this.prisma.tBL_COMFORTS.count({
          where: { status: true },
        });

      }

      const pageMetaDto = new PageMetaInput({ itemCount, pageOptionsArgs });
      const finalResult = new PageInput(getComforts, pageMetaDto)

      return {
        data: getComforts,
        meta: pageMetaDto
      };
      
    } catch (error) {

      logger.log(`Ocurrió un error al intentar obtener listado de comodidades: ${error}`);
      throw CustomError.internalServerError(`${error}`);
      
    } finally {
      
      logger.log(`Listado de comodidades finalizada`);
      await this.prisma.$disconnect();

    }
    
  }

  async findOne(
    id: number
  ): Promise<Comfort | CustomError> {

    const logger = new Logger('ComfortsService - findOne');

    try {
      
      const getComfort = await this.prisma.tBL_COMFORTS.findFirst({
        where: {
          AND: [
            { id },
            { status: true }
          ]
        }
      })

      if( getComfort == null ) return CustomError.notFoundError(`No se encontró comodidad con el ID ${id}`);

      return getComfort;

    } catch (error) {

      logger.log(`Ocurrió un error al intentar obtener una comodidad por ID: ${error}`);
      throw CustomError.internalServerError(`${error}`);
      
    } finally {
      
      logger.log(`Obtener una comodidad por ID finalizada`);
      await this.prisma.$disconnect();

    }

  }

  async update(
    id: number, 
    updateComfortInput: UpdateComfortInput,
    user: User
  ): Promise<Comfort | CustomError> {
    
    const logger = new Logger('ComfortsService - update');
    const { name, description } = updateComfortInput;

    try {

      //Verificación del ID
      const existComfort = await this.prisma.tBL_COMFORTS.findFirst({
        where: { id }
      });

      if( existComfort == null ) return CustomError.notFoundError(`No se encontró comodidad con el ID ${id}`);

      //Verificación del nombre y descripción
      const existDescriptionAndNameComfort = await this.prisma.tBL_COMFORTS.findMany({
        where: {
          OR: [
            { name },
            { description }
          ]
        }
      })

      //Validamos que no se repita pero en términos de un ID diferente
      if( existDescriptionAndNameComfort.length > 0 ){
        if( existDescriptionAndNameComfort[0].id != id ){
          return CustomError.badRequestError("Ya existe el nombre de comodidad y/o la descripción");
        }
      }

      const updateComfort = await this.prisma.tBL_COMFORTS.update({
        where: { id },
        data: {
          name,
          description,
          userUpdateAt: user.email,
          updateDateAt: new Date(),
        }
      });

      return updateComfort;
      
    } catch (error) {

      logger.log(`Ocurrió un error al intentar actualizar una comodidad por ID: ${error}`);
      throw CustomError.internalServerError(`${error}`);
      
    } finally {
      
      logger.log(`Actualización de una comodidad por ID finalizada`);
      await this.prisma.$disconnect();

    }
    
  }

  async remove(
    id: number,
    user: User
  ): Promise<Comfort | CustomError> {

    const logger = new Logger('ComfortsService - remove');

    try {

      //Verificación del ID
      const existComfort = await this.prisma.tBL_COMFORTS.findFirst({
        where: { id }
      });

      if( existComfort == null ) return CustomError.notFoundError(`No se encontró comodidad con el ID ${id}`);

      const updateComfort = await this.prisma.tBL_COMFORTS.update({
        where: { id },
        data: { 
          userUpdateAt: user.email,
          updateDateAt: new Date(),
          status: false
        }
      });

      return updateComfort;
      
    } catch (error) {

      logger.log(`Ocurrió un error al intentar remover una comodidad por ID: ${error}`);
      throw CustomError.internalServerError(`${error}`);
      
    } finally {
      
      logger.log(`Eliminación lógica una comodidad por ID finalizada`);
      await this.prisma.$disconnect();

    }

  }
}
