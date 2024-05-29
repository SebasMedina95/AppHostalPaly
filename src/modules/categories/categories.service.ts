import { Injectable, Logger } from '@nestjs/common';
import { CreateCategoryInput } from './dto/inputs/create-category.input';
import { UpdateCategoryInput } from './dto/inputs/update-category.input';
import { Category } from './entities/category.entity';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { CustomError } from 'src/helpers/errors/custom.error';
import { ETheme } from '@prisma/client';

@Injectable()
export class CategoriesService {

  constructor(
    private prisma: PrismaService
  ){}

  async create(createCategoryInput: CreateCategoryInput): Promise<Category | CustomError> {

    const logger = new Logger('CategoriesService - create')
    const { name, description, theme } = createCategoryInput;
    const themeEnum = theme as ETheme;

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
          theme: themeEnum,
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


  async findAll(): Promise<Category[] | CustomError> {

    const logger = new Logger('CategoriesService - findAll')

    try {
      
      const getCategories = await this.prisma.tBL_CATEGORIES.findMany({});

      return getCategories;

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
    const themeEnum = theme as ETheme;

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
          theme: themeEnum,
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
