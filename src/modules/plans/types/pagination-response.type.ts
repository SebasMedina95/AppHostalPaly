import { Field, ObjectType } from "@nestjs/graphql";
import { PageMetaInput } from "../../../helpers/pagination/dto/page-meta.input";
import { Plan } from "../entities/plan.entity";

@ObjectType()
export class PlanPaginationResponse {

    @Field( () => [Plan] )
    data: Plan[];

    @Field( () => PageMetaInput )
    meta: PageMetaInput;

}
