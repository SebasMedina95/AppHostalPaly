import { Field,
         InputType,
         Int } from "@nestjs/graphql";
import { Type } from "class-transformer";
import { IsEnum,
         IsInt,
         IsOptional,
         IsString,
         Max,
         Min } from "class-validator";

export enum Order {
    ASC = "asc",
    DESC = "desc",
}

@InputType()
export class PageOptionsArgs {

    @Field( () => String, { nullable: false, defaultValue: "asc" })
    @IsEnum(Order)
    @IsOptional()
    readonly order?: Order = Order.ASC;

    @Field( () => Int, { nullable: false, defaultValue: 1 })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @IsOptional()
    readonly page?: number = 1;

    @Field( () => Int, { nullable: false, defaultValue: 10 })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(50)
    @IsOptional()
    readonly take?: number = 10;

    @Field( () => String, { nullable: false, defaultValue: "" })
    @Type(() => String)
    @IsString()
    @IsOptional()
    readonly search?: string = "";

    get skip(): number {
        return (this.page - 1) * this.take;
    }

}