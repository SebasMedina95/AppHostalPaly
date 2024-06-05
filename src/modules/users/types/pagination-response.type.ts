import { Field, ObjectType } from "@nestjs/graphql";
import { User } from "../entities/user.entity";
import { PageMetaInput } from "src/helpers/pagination/dto/page-meta.input";

@ObjectType()
export class UserPaginationResponse {

    @Field( () => [User] )
    data: User[];

    @Field( () => PageMetaInput )
    meta: PageMetaInput;

}