import { Field, ObjectType } from "@nestjs/graphql";
import { Category } from "../entities/category.entity";
import { PageMetaInput } from "../../../helpers/pagination/dto/page-meta.input";
import { Comfort } from "src/modules/comforts/entities/comfort.entity";

@ObjectType()
export class BuildListResponse {

    @Field(() => Category)
    getCategories: Category;

    @Field(() => [Comfort])
    arrayComforts: Comfort[];
}

@ObjectType()
export class CategoryPaginationResponse {

    // @Field( () => [Category] )
    // data: Category[];

    @Field( () => [BuildListResponse] )
    data: BuildListResponse[];

    @Field( () => PageMetaInput )
    meta: PageMetaInput;

}
