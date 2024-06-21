import { Field, ObjectType } from "@nestjs/graphql";

import { PageMetaInput } from "../../../helpers/pagination/dto/page-meta.input";

import { Room } from "../entities/room.entity";
import { Category } from "../../../modules/categories/entities/category.entity";

@ObjectType()
//export class BuildListRoomResponse {

    // @Field( () => Room )
    // room: Room;

    // @Field( () => Category )
    // category: Category;
//}

@ObjectType()
export class RoomPaginationResponse {

    @Field( () => [Room] )
    data: Room[];

    @Field( () => PageMetaInput )
    meta: PageMetaInput;

}
