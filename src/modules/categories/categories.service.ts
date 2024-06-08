import { Injectable,
         Logger } from '@nestjs/common';

import { PrismaService } from 'src/config/prisma/prisma.service';

import { Category } from './entities/category.entity';
import { User } from '../users/entities/user.entity';
import { ComfortsForCategory } from './entities/comforts-of-category.entity';
import { Comfort } from '../comforts/entities/comfort.entity';

import { CreateCategoryInput } from './dto/inputs/create-category.input';
import { UpdateCategoryInput } from './dto/inputs/update-category.input';

import { CustomError } from '../../helpers/errors/custom.error';
import { PageOptionsArgs } from '../../helpers/pagination/dto/page-options.args';
import { PageMetaInput } from '../../helpers/pagination/dto/page-meta.input';
import { PageInput } from '../../helpers/pagination/dto/page.input';

import { BuildListResponse,
         CategoryPaginationResponse } from './types/pagination-response.type';
import { CategoryResponse, 
         CategoryResponseWithComforts } from './types/create-update-response.type';

@Injectable()
export class CategoriesService {

  constructor(
    private prisma: PrismaService
  ){}

  async create(createCategoryInput: CreateCategoryInput, user: User): Promise<CategoryResponse | CustomError> {

    const logger = new Logger('CategoriesService - create')
    const { name, description, theme } = createCategoryInput;

    try {

      const existCategory = await this.prisma.tBL_CATEGORIES.findMany({
        where: {
          OR: [
            { name },
            { description }
          ]
        }
      })

      if( existCategory.length > 0 ) return CustomError.badRequestError("Ya existe el nombre de categoría y/o la descripción");

      const newCategory = await this.prisma.tBL_CATEGORIES.create({
        data: {
          name,
          description,
          theme,
          userCreateAt: user.email,
          createDateAt: new Date(),
          userUpdateAt: user.email,
          updateDateAt: new Date(),
        }
      })

      //Si dado el caso vamos a registrar las comodidades de una vez ...
      let arrayComfortsForCategory: ComfortsForCategory[] = [];
      if( createCategoryInput.comfortsList && createCategoryInput.comfortsList != null ){

        for (const iter of createCategoryInput.comfortsList) {
          
          const createComforts = await this.prisma.tBL_DTL_COMFORTS_CATEGORIES.create({
            data: {
              userCreateAt: user.email,
              createDateAt: new Date(),
              categoryId: newCategory.id,
              comfortId: iter
            }
          });

          arrayComfortsForCategory.push(createComforts);

        }  

      }

      return {
        category: newCategory,
        comfortsList: arrayComfortsForCategory
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
  ): Promise<CategoryPaginationResponse> {

    const logger = new Logger('CategoriesService - findAll')
    const { take, page, search, order } = pageOptionsArgs;
    let getCategories: Category[] = [];
    let itemCount: number = 0;

    try {
      
      if( search && search !== "" && search !== null && search !== undefined  ){

        getCategories = await this.prisma.tBL_CATEGORIES.findMany({
          take,
          skip: Number(page - 1) * take,
          where: {
              OR: [
                  { name: { contains: search, mode: 'insensitive' } },
                  { description: { contains: search, mode: 'insensitive' } },
                  { theme: { contains: search, mode: 'insensitive' } },
              ],
              AND: [
                  { status: true }
              ]
          },
          orderBy: { id: order }
        });

        itemCount = await this.prisma.tBL_CATEGORIES.count({
          where: {
            OR: [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
                { theme: { contains: search, mode: 'insensitive' } },
            ],
            AND: [
                { status: true }
            ]
          },
        });

      }else{

        getCategories = await this.prisma.tBL_CATEGORIES.findMany({
          take,
          skip: Number(page - 1) * take,
          include: {
            TBL_DTL_COMFORTS_CATEGORIES: {
              include: {
                comfort: true
              }
            }
          },
          where: {  status: true },
          orderBy: { id: order }
        });

        itemCount = await this.prisma.tBL_CATEGORIES.count({
          where: { status: true },
        });

      }

      //Vamos a traer las comodidades
      //Es una consulta invertida
      let finalResponse: BuildListResponse[] = [];
      for (const iterDetails of getCategories) {

        let arrayComforts: Comfort[] = [];

        const getDetails = await this.prisma.tBL_DTL_COMFORTS_CATEGORIES.findMany({
          where: { categoryId: iterDetails.id }
        });

        for (const iterComforts of getDetails) {
          
          const getComforts = await this.prisma.tBL_COMFORTS.findFirst({
            where: { id: iterComforts.comfortId }
          })

          if( getComforts ) arrayComforts.push(getComforts);

        }

        finalResponse.push({
          getCategories: iterDetails,
          arrayComforts
        });

      }

      const pageMetaDto = new PageMetaInput({ itemCount, pageOptionsArgs });
      const finalResult = new PageInput(getCategories, pageMetaDto)

      return {
        data: finalResponse,
        meta: pageMetaDto
      };

    } catch (error) {

      logger.log(`Ocurrió un error al intentar obtener listado de categorías: ${error}`);
      throw CustomError.internalServerError(`${error}`);
      
    } finally {
      
      logger.log(`Listado de categorías finalizada`);
      await this.prisma.$disconnect();

    }

  }

  async findOne(id: number): Promise<CategoryResponseWithComforts | CustomError> {

    const logger = new Logger('CategoriesService - findOne')

    try {
      
      const getCategory = await this.prisma.tBL_CATEGORIES.findFirst({
        where: {
          AND: [
            { id },
            { status: true }
          ]
        }
      })

      if( getCategory == null ) return CustomError.notFoundError(`No se encontró categoría con el ID ${id}`);

      //Obtengamos las comodidades
      let arrayComforts: Comfort[] = [];
      const getComfortsDetails = await this.prisma.tBL_DTL_COMFORTS_CATEGORIES.findMany({
        where: { categoryId: getCategory.id }
      });

      for (const iter of getComfortsDetails) {
        const getComfort = await this.prisma.tBL_COMFORTS.findFirst({
          where: { id : iter.id }
        });

        if( getComfort ) arrayComforts.push(getComfort);

      }

      return {
        category: getCategory,
        comfortsList: arrayComforts
      }

    } catch (error) {

      logger.log(`Ocurrió un error al intentar obtener una categoría por ID: ${error}`);
      throw CustomError.internalServerError(`${error}`);
      
    } finally {
      
      logger.log(`Obtener una categoría por ID finalizada`);
      await this.prisma.$disconnect();

    }

  }

  async update(
    id: number, 
    updateCategoryInput: UpdateCategoryInput,
    user: User
  ): Promise<CategoryResponse | CustomError> {

    const logger = new Logger('CategoriesService - update');
    const { name, description, theme } = updateCategoryInput;

    try {

      //Verificación del ID
      const existCategory = await this.prisma.tBL_CATEGORIES.findFirst({
        where: { id }
      });

      if( existCategory == null ) return CustomError.notFoundError(`No se encontró categoría con el ID ${id}`);

      //Verificación del nombre y descripción
      const existDescriptionAndNameCategory = await this.prisma.tBL_CATEGORIES.findMany({
        where: {
          OR: [
            { name },
            { description }
          ]
        }
      })

      //Validamos que no se repita pero en términos de un ID diferente
      if( existDescriptionAndNameCategory.length > 0 ){
        if( existDescriptionAndNameCategory[0].id != id ){
          return CustomError.badRequestError("Ya existe el nombre de categoría y/o la descripción");
        }
      }

      const updateCategory = await this.prisma.tBL_CATEGORIES.update({
        where: { id },
        data: {
          name,
          description,
          theme,
          userUpdateAt: user.email,
          updateDateAt: new Date(),
        }
      });

      //Si dado el caso vamos a registrar las comodidades de una vez ...
      let arrayComfortsForCategory: ComfortsForCategory[] = [];
      if( updateCategoryInput.comfortsList && updateCategoryInput.comfortsList != null ){

        //Primero verificamos las comodidades que tenemos, las borramos primero y re registramos
        await this.prisma.tBL_DTL_COMFORTS_CATEGORIES.deleteMany({
          where: { categoryId: updateCategory.id }
        })

        for (const iter of updateCategoryInput.comfortsList) {
          
          const createComforts = await this.prisma.tBL_DTL_COMFORTS_CATEGORIES.create({
            data: {
              userCreateAt: user.email,
              createDateAt: new Date(),
              categoryId: updateCategory.id,
              comfortId: iter
            }
          });

          arrayComfortsForCategory.push(createComforts);

        }  

      }

      return {
        category: updateCategory,
        comfortsList: arrayComfortsForCategory
      };
      
    } catch (error) {

      logger.log(`Ocurrió un error al intentar obtener una categoría por ID: ${error}`);
      throw CustomError.internalServerError(`${error}`);
      
    } finally {
      
      logger.log(`Actualizar una categoría por ID finalizada`);
      await this.prisma.$disconnect();

    }

  }

  async remove(id: number, user: User): Promise<Category | CustomError> {

    const logger = new Logger('CategoriesService - remove');

    try {

      //Verificación del ID
      const existCategory = await this.prisma.tBL_CATEGORIES.findFirst({
        where: { id }
      });

      if( existCategory == null ) return CustomError.notFoundError(`No se encontró categoría con el ID ${id}`);

      const updateCategory = await this.prisma.tBL_CATEGORIES.update({
        where: { id },
        data: {
          userUpdateAt: user.email,
          updateDateAt: new Date(), 
          status: false 
        }
      });

      return updateCategory;
      
    } catch (error) {

      logger.log(`Ocurrió un error al intentar obtener una categoría por ID: ${error}`);
      throw CustomError.internalServerError(`${error}`);
      
    } finally {
      
      logger.log(`Eliminado lógico de una categoría por ID finalizada`);
      await this.prisma.$disconnect();

    }

  }
}
