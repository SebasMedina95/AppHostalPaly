import { Field, ObjectType } from "@nestjs/graphql";

import { Category } from "../entities/category.entity";
import { Comfort } from "../../../modules/comforts/entities/comfort.entity";
import { ComfortsForCategory } from "../entities/comforts-of-category.entity";


@ObjectType()
export class CategoryResponse {

    @Field( () => Category )
    category: Category;

    @Field( () => [ComfortsForCategory] )
    comfortsList: ComfortsForCategory[];

}

@ObjectType()
export class CategoryResponseWithComforts {

    @Field( () => Category )
    category: Category;

    @Field( () => [Comfort] )
    comfortsList: Comfort[];

}