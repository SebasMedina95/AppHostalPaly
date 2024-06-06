import { Field, ObjectType } from "@nestjs/graphql";
import { Comfort } from "../entities/comfort.entity";
import { PageMetaInput } from "../../../helpers/pagination/dto/page-meta.input";

@ObjectType()
export class ComfortPaginationResponse {

    @Field( () => [Comfort] )
    data: Comfort[];

    @Field( () => PageMetaInput )
    meta: PageMetaInput;

}
