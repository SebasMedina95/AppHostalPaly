import { Field, ObjectType } from "@nestjs/graphql";
import { User } from "../../../modules/users/entities/user.entity";
import { CustomError } from "../../../helpers/errors/custom.error";


@ObjectType()
export class AuthResponse {

    @Field( () => User )
    user: User | CustomError;

    @Field( () => String )
    token: string;

}
