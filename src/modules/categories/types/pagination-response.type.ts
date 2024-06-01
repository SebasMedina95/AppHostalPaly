import { Field, ObjectType } from "@nestjs/graphql";
import { Category } from "../entities/category.entity";
import { PageMetaInput } from "src/helpers/pagination/dto/page-meta.input";

@ObjectType()
export class CategoryPaginationResponse {

    @Field( () => [Category] )
    data: Category[];

    @Field( () => PageMetaInput )
    meta: PageMetaInput;

}
