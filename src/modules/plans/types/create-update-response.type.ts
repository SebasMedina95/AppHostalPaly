import { Field, ObjectType } from "@nestjs/graphql";
import { Plan } from "../entities/plan.entity";

@ObjectType()
export class PlanResponse {

    @Field( () => Plan )
    plan: Plan;

}