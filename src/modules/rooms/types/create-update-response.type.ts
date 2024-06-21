import { Field, ObjectType } from "@nestjs/graphql";

import { Room } from "../entities/room.entity";
import { Category } from "../../../modules/categories/entities/category.entity";
import { CategoryResponseWithComforts } from "../../../modules/categories/types/create-update-response.type";


@ObjectType()
export class RoomResponse {

    @Field( () => Room )
    room: Room;

    @Field( () => CategoryResponseWithComforts )
    categoryResponse: CategoryResponseWithComforts;

    //@Field( () => Category )
    //category: Category;

}