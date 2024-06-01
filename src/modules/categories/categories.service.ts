import { Injectable,
         Logger } from '@nestjs/common';

import { CreateCategoryInput } from './dto/inputs/create-category.input';
import { UpdateCategoryInput } from './dto/inputs/update-category.input';

import { PrismaService } from 'src/config/prisma/prisma.service';
import { Category } from './entities/category.entity';
import { CustomError } from 'src/helpers/errors/custom.error';

import { PageOptionsArgs } from 'src/helpers/pagination/dto/page-options.args';
import { PageMetaInput } from 'src/helpers/pagination/dto/page-meta.input';
import { PageInput } from 'src/helpers/pagination/dto/page.input';
import { CategoryPaginationResponse } from './types/pagination-response.type';

@Injectable()
export class CategoriesService {

  constructor(
    private prisma: PrismaService
  ){}

  async create(createCategoryInput: CreateCategoryInput): Promise<Category | CustomError> {

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
          userDocumentCreateAt: "123456789",
          createDateAt: new Date(),
          userDocumentUpdateAt: "123456789",
          updateDateAt: new Date(),
        }
      })

      return newCategory;
      
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
          where: {  status: true },
          orderBy: { id: order }
        });

        itemCount = await this.prisma.tBL_CATEGORIES.count({
          where: { status: true },
        });

      }

      const pageMetaDto = new PageMetaInput({ itemCount, pageOptionsArgs });
      const finalResult = new PageInput(getCategories, pageMetaDto)

      return {
        data: getCategories,
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

  async findOne(id: number): Promise<Category | CustomError> {

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

      return getCategory;

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
    updateCategoryInput: UpdateCategoryInput
  ): Promise<Category | CustomError> {

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
          userDocumentUpdateAt: "123456789",
          updateDateAt: new Date(),
        }
      });

      return updateCategory;
      
    } catch (error) {

      logger.log(`Ocurrió un error al intentar obtener una categoría por ID: ${error}`);
      throw CustomError.internalServerError(`${error}`);
      
    } finally {
      
      logger.log(`Obtener una categoría por ID finalizada`);
      await this.prisma.$disconnect();

    }

  }

  async remove(id: number): Promise<Category | CustomError> {

    const logger = new Logger('CategoriesService - remove');

    try {

      //Verificación del ID
      const existCategory = await this.prisma.tBL_CATEGORIES.findFirst({
        where: { id }
      });

      if( existCategory == null ) return CustomError.notFoundError(`No se encontró categoría con el ID ${id}`);

      const updateCategory = await this.prisma.tBL_CATEGORIES.update({
        where: { id },
        data: { status: false }
      });

      return updateCategory;
      
    } catch (error) {

      logger.log(`Ocurrió un error al intentar obtener una categoría por ID: ${error}`);
      throw CustomError.internalServerError(`${error}`);
      
    } finally {
      
      logger.log(`Obtener una categoría por ID finalizada`);
      await this.prisma.$disconnect();

    }

  }
}
