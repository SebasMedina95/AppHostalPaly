import { IsArray, IsOptional } from "class-validator";
import { ValidRoles } from "../../../../constants/roles.enum";
import { ArgsType, Field } from "@nestjs/graphql";

@ArgsType()
export class ValidRolesArgs {

    @Field( () => [ValidRoles], { nullable: true })
    @IsOptional()
    @IsArray()
    roles?: ValidRoles[] = [];

}
