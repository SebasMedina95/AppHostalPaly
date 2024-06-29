import { Resolver,
         Query,
         Mutation,
         Args,
         Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { PlansService } from './plans.service';

import { Plan } from './entities/plan.entity';
import { User } from '../users/entities/user.entity';

import { CreatePlanInput } from './dto/create-plan.input';
import { UpdatePlanInput } from './dto/update-plan.input';

import { ValidRoles } from '../../constants/roles.enum';
import { CustomError } from '../../helpers/errors/custom.error';
import { PageOptionsArgs } from '../../helpers/pagination/dto/page-options.args';

import { PlanResponse } from './types/create-update-response.type';
import { PlanPaginationResponse } from './types/pagination-response.type';

import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Resolver(() => Plan)
@UseGuards( JwtAuthGuard ) //? El JwtAuthGuard es mi Guard personalizado para GraphQL
export class PlansResolver {

  constructor(private readonly plansService: PlansService) {}

  @Mutation(() => Plan, { name: "createPlan", description: "Crear un nuevo plan" })
  async createPlan(
    @Args('createPlanInput') createPlanInput: CreatePlanInput,
    @CurrentUser([ ValidRoles.EMPLOYEE_NV1, ValidRoles.ADMIN ]) user: User
  ): Promise<Plan | CustomError> {

    return this.plansService.create(createPlanInput, user);

  }

  @Query(() => PlanPaginationResponse, { name: 'findAllPlan', description: "Listar planes con paginación y filtro" })
  async findAll(
    @Args('pageOptionsArgs') pageOptionsArgs: PageOptionsArgs,
    @CurrentUser([ ValidRoles.EMPLOYEE_NV1, ValidRoles.ADMIN ]) user: User
  ): Promise<PlanPaginationResponse> {

    return this.plansService.findAll(pageOptionsArgs);

  }

  @Query(() => Plan, { name: 'findOnePlan', description: "Obtener plan por ID" })
  async findOne(
    @Args('id', { type: () => Int }) id: number
  ) {

    return this.plansService.findOne(id);

  }

  @Mutation(() => Plan, { name: 'updatePlan', description: "Actualizar un plan" })
  async updatePlan(
    @Args('updatePlanInput') updatePlanInput: UpdatePlanInput,
    @CurrentUser([ ValidRoles.EMPLOYEE_NV1, ValidRoles.ADMIN ]) user: User
  ) {

    return this.plansService.update(updatePlanInput.id, updatePlanInput, user);

  }

  @Mutation(() => Plan, { name: 'removePlan', description: "Eliminar lógicamente un plan" })
  async removePlan(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser([ ValidRoles.EMPLOYEE_NV1, ValidRoles.ADMIN ]) user: User
  ) {

    return this.plansService.remove(id, user);

  }
}
