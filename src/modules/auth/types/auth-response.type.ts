import { Field, ObjectType } from "@nestjs/graphql";
import { User } from "../../../modules/users/entities/user.entity";


@ObjectType()
export class AuthResponse {

    @Field( () => User )
    user: User;

    @Field( () => String )
    token: string;

}
