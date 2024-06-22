import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../config/prisma/prisma.service';

import { CreateRoomInput } from './dto/inputs/create-room.input';
import { UpdateRoomInput } from './dto/inputs/update-room.input';
import { CategoriesService } from '../categories/categories.service';
import { User } from '../users/entities/user.entity';
import { Room } from './entities/room.entity';

import { RoomResponse } from './types/create-update-response.type';
import { RoomPaginationResponse } from './types/pagination-response.type';

import { CustomError } from '../../helpers/errors/custom.error';
import { PageOptionsArgs } from '../../helpers/pagination/dto/page-options.args';
import { PageMetaInput } from '../../helpers/pagination/dto/page-meta.input';

@Injectable()
export class RoomsService {

  constructor(
    private prisma: PrismaService,
    private categoryService: CategoriesService
  ){}

  async create(
    createRoomInput: CreateRoomInput, user: User
  ): Promise<RoomResponse | CustomError> {

    const logger = new Logger('RoomsService - create');
    const { name, categoryId } = createRoomInput;

    try {

      const existRoom = await this.prisma.tBL_ROOMS.findMany({
        where: { name }
      });

      if( existRoom.length > 0 ) 
        return CustomError.badRequestError("Ya existe el nombre de habitación");

      const existCategory = await this.categoryService.findOne(categoryId);
      // const existCategory = await this.prisma.tBL_CATEGORIES.findFirst({
      //   where: { id: categoryId }
      // })

      if( !existCategory || existCategory instanceof CustomError )
        return CustomError.badRequestError("La categoría de habitación no pudo ser hallada");

      const newRoom = await this.prisma.tBL_ROOMS.create({
        data: {
          ...createRoomInput,
          userCreateAt: user.email,
          createDateAt: new Date(),
          userUpdateAt: user.email,
          updateDateAt: new Date(),
        }
      });

      console.log({newRoom});
      console.log({existCategory});

      return {
        room: newRoom,
        categoryResponse: existCategory
      };
      
    } catch (error) {

      logger.log(`Ocurrió un error al intentar crear la categoría: ${error}`);
      throw CustomError.internalServerError(`${error}`);
      
    } finally {
      
      logger.log(`Creación de categoría finalizada`);
      await this.prisma.$disconnect();

    }
    
  }

  async findAll(
    pageOptionsArgs: PageOptionsArgs
  ): Promise<RoomPaginationResponse> {
    
    const logger = new Logger('RoomsService - findAll')
    const { take, page, search, order } = pageOptionsArgs;
    let getRooms: Room[] = [];
    let itemCount: number = 0;

    try {

      if( search && search !== "" && search !== null && search !== undefined  ){

        getRooms = await this.prisma.tBL_ROOMS.findMany({
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
          include: {
            category: true
          },
          orderBy: { id: order }
        });

        itemCount = await this.prisma.tBL_ROOMS.count({
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

        getRooms = await this.prisma.tBL_ROOMS.findMany({
          take,
          skip: Number(page - 1) * take,
          include: {
            category: true
          },
          where: {  status: true },
          orderBy: { id: order }
        });

        itemCount = await this.prisma.tBL_ROOMS.count({
          where: { status: true },
        });

      }

      const pageMetaDto = new PageMetaInput({ itemCount, pageOptionsArgs });

      return {
        data: getRooms,
        meta: pageMetaDto
      };
      
    } catch (error) {

      logger.log(`Ocurrió un error al intentar obtener listado de habitaciones: ${error}`);
      throw CustomError.internalServerError(`${error}`);
      
    } finally {
      
      logger.log(`Listado de categorías finalizada`);
      await this.prisma.$disconnect();

    }
    
  }

  async findOne(id: number): Promise<Room | CustomError> {
    
    const logger = new Logger('RoomsService - findOne');

    try {

      const getRoom = await this.prisma.tBL_ROOMS.findFirst({
        where: {
          AND: [
            { id },
            { status: true }
          ]
        },
        include: {
          category: true
        }
      })

      if( getRoom == null ) return CustomError.notFoundError(`No se encontró habitación con el ID ${id}`);

      return getRoom;
      
    } catch (error) {

      logger.log(`Ocurrió un error al intentar obtener una habitación por ID: ${error}`);
      throw CustomError.internalServerError(`${error}`);
      
    } finally {
      
      logger.log(`Obtener una habitación por ID finalizada`);
      await this.prisma.$disconnect();

    }
    
  }

  async update(id: number, 
               updateRoomInput: UpdateRoomInput,
               user: User): Promise<Room | CustomError> {
    
    const logger = new Logger('RoomsService - update');
    const { name, description, maintenance } = updateRoomInput;

    try {

      //Verificación del ID
      const existRoom = await this.prisma.tBL_ROOMS.findFirst({
        where: { id }
      });

      if( existRoom == null ) 
        return CustomError.notFoundError(`No se encontró habitación con el ID ${id}`);

      //Verificación del nombre y descripción
      const existNameRoom = await this.prisma.tBL_ROOMS.findMany({
        where: { name }, 
      });

      //Validamos que no se repita pero en términos de un ID diferente
      if( existNameRoom.length > 0 ){
        if( existNameRoom[0].id != id ){
          return CustomError.badRequestError("Ya existe el nombre de habitación");
        }
      }

      const updateRoom = await this.prisma.tBL_ROOMS.update({
        where: { id },
        data: {
          name,
          description,
          maintenance,
          userUpdateAt: user.email,
          updateDateAt: new Date(),
        }
      });

      return updateRoom;
      
    } catch (error) {

      logger.log(`Ocurrió un error al intentar actualizar una habitación por ID: ${error}`);
      throw CustomError.internalServerError(`${error}`);
      
    } finally {
      
      logger.log(`Actualización de una habitación por ID finalizada`);
      await this.prisma.$disconnect();

    }
    
  }

  async remove(id: number, user: User): Promise<Room | CustomError> {
    
    const logger = new Logger('RoomsService - remove');

    try {

      //Verificación del ID
      const existRoom = await this.prisma.tBL_ROOMS.findFirst({
        where: { id }
      });

      if( existRoom == null ) 
        return CustomError.notFoundError(`No se encontró habitación con el ID ${id}`);

      const updateRoom = await this.prisma.tBL_ROOMS.update({
        where: { id },
        data: { 
          userUpdateAt: user.email,
          updateDateAt: new Date(),
          status: false
        }
      });

      return updateRoom;
      
    } catch (error) {

      logger.log(`Ocurrió un error al intentar remover una habitación por ID: ${error}`);
      throw CustomError.internalServerError(`${error}`);
      
    } finally {
      
      logger.log(`Eliminación lógica una comodidad por ID finalizada`);
      await this.prisma.$disconnect();

    }
    
  }

  async findByCategory(id: number): Promise<Room[] | CustomError> {
    
    const logger = new Logger('RoomsService - findByCategory');

    try {

      const getRoomsByCategoy = await this.prisma.tBL_ROOMS.findMany({
        where: {
          AND: [
            { categoryId: id },
            { status: true }
          ]
        },
        include: {
          category: true
        }
      })

      return getRoomsByCategoy;
      
    } catch (error) {

      logger.log(`Ocurrió un error al intentar obtener el listado de habitaciones por categoría: ${error}`);
      throw CustomError.internalServerError(`${error}`);
      
    } finally {
      
      logger.log(`Obtener una habitación por ID de categoría finalizada`);
      await this.prisma.$disconnect();

    }
    
  }

}
