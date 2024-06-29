import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../config/prisma/prisma.service';

import { CreatePlanInput } from './dto/create-plan.input';
import { UpdatePlanInput } from './dto/update-plan.input';

import { CustomError } from '../../helpers/errors/custom.error';
import { PageOptionsArgs } from '../../helpers/pagination/dto/page-options.args';
import { PageMetaInput } from '../../helpers/pagination/dto/page-meta.input';
import { PageInput } from '../../helpers/pagination/dto/page.input';

import { User } from '../users/entities/user.entity';
import { Plan } from './entities/plan.entity';

import { PlanResponse } from './types/create-update-response.type';
import { PlanPaginationResponse } from './types/pagination-response.type';

@Injectable()
export class PlansService {

  constructor(
    private prisma: PrismaService
  ){}

  async create(
    createPlanInput: CreatePlanInput, 
    user: User
  ): Promise<Plan | CustomError> {

    const logger = new Logger('PlansService - create')
    const { type,
            description,
            highSeasonPrice,
            LowSeasonPrice,
            urlImage = "default.png" } = createPlanInput;

    try {
      
      const existPlan = await this.prisma.tBL_PLANS.findMany({
        where: {
          OR: [
            { type },
            { description }
          ]
        }
      });

      if( existPlan.length > 0 ) 
        return CustomError.badRequestError("Ya existe el nombre de plan y/o la descripción");

      const newPlan = await this.prisma.tBL_PLANS.create({
        data: {
          type,
          description,
          highSeasonPrice,
          LowSeasonPrice,
          urlImage,
          userCreateAt: user.email,
          createDateAt: new Date(),
          userUpdateAt: user.email,
          updateDateAt: new Date(),
        }
      });

      delete newPlan.urlImage;
      return newPlan;
      
    } catch (error) {

      logger.log(`Ocurrió un error al intentar crear el plan: ${error}`);
      throw CustomError.internalServerError(`${error}`);
      
    } finally {
      
      logger.log(`Creación de plan finalizada`);
      await this.prisma.$disconnect();

    }

  }

  async findAll(
    pageOptionsArgs: PageOptionsArgs
  ): Promise<PlanPaginationResponse> {

    const logger = new Logger('PlansService - findAll')
    const { take, page, search, order } = pageOptionsArgs;
    let getPlans: Plan[] = [];
    let itemCount: number = 0;

    try {

      if( search && search !== "" && search !== null && search !== undefined  ){

        getPlans = await this.prisma.tBL_PLANS.findMany({
          take,
          skip: Number(page - 1) * take,
          where: {
              OR: [
                  { type: { contains: search, mode: 'insensitive' } },
                  { description: { contains: search, mode: 'insensitive' } },
              ],
              AND: [
                  { status: true }
              ]
          },
          orderBy: { id: order }
        });

        itemCount = await this.prisma.tBL_PLANS.count({
          where: {
            OR: [
                { type: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ],
            AND: [
                { status: true }
            ]
          },
        });

      }else{

        getPlans = await this.prisma.tBL_PLANS.findMany({
          take,
          skip: Number(page - 1) * take,
          where: {  status: true },
          orderBy: { id: order }
        });

        itemCount = await this.prisma.tBL_PLANS.count({
          where: { status: true },
        });

      }

      const pageMetaDto = new PageMetaInput({ itemCount, pageOptionsArgs });
      const finalResult = new PageInput(getPlans, pageMetaDto)

      return {
        data: getPlans,
        meta: pageMetaDto
      };
      
    } catch (error) {

      logger.log(`Ocurrió un error al intentar obtener listado de planes: ${error}`);
      throw CustomError.internalServerError(`${error}`);
      
    } finally {
      
      logger.log(`Listado de planes finalizada`);
      await this.prisma.$disconnect();

    }

  }

  async findOne(
    id: number
  ): Promise<Plan | CustomError> {
    
    const logger = new Logger('PlansService - findOne');

    try {
      
      const getPlan = await this.prisma.tBL_PLANS.findFirst({
        where: {
          AND: [
            { id },
            { status: true }
          ]
        }
      })

      if( getPlan == null ) return CustomError.notFoundError(`No se encontró plan con el ID ${id}`);

      return getPlan;

    } catch (error) {

      logger.log(`Ocurrió un error al intentar obtener un plan por ID: ${error}`);
      throw CustomError.internalServerError(`${error}`);
      
    } finally {
      
      logger.log(`Obtener un plan por ID finalizada`);
      await this.prisma.$disconnect();

    }

  }

  async update(
    id: number, 
    updatePlanInput: UpdatePlanInput, 
    user: User
  ): Promise<Plan | CustomError> {

    throw new Error(`Método sin implementar aún`);

  }

  async remove(
    id: number, 
    user: User
  ): Promise<Plan | CustomError> {

    throw new Error(`Método sin implementar aún`);

  }
}
