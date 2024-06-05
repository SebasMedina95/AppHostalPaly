import { Field, InputType } from "@nestjs/graphql";
import { IsEmail,
         IsIn,
         IsNotEmpty,
         IsOptional,
         IsString,
         Matches,
         MaxLength,
         MinLength } from "class-validator";

@InputType()
export class SignupInput {

    @IsString({ message: "Los nombres del usuario deben ser válido" })
    @MinLength(3, { message: "Los nombres del usuario deben tener al menos 3 caracteres" })
    @MaxLength(150, { message: "Los nombres del usuario no pueden exceder los 150 caracteres" })
    @IsNotEmpty({ message: "Los nombres del usuario son obligatorios" })
    @Field( () => String )
    names: string;

    @IsString({ message: "Los apellidos del usuario deben ser válido" })
    @MinLength(3, { message: "Los apellidos del usuario deben tener al menos 3 caracteres" })
    @MaxLength(150, { message: "Los apellidos del usuario no pueden exceder los 150 caracteres" })
    @IsNotEmpty({ message: "Los apellidos del usuario son obligatorios" })
    @Field( () => String )
    lastnames: string;

    @IsEmail({}, { message: "El email del usuario debe ser válido" })
    @MinLength(5, { message: "El email del usuario debe tener al menos 5 caracteres" })
    @MaxLength(150, { message: "El email del usuario no pueden exceder los 150 caracteres" })
    @IsNotEmpty({ message: "El email del usuario es obligatorios" })
    @Field( () => String )
    email: string;

    @IsString({ message: "La contraseña debe ser válido" })
    @MinLength(8, { message: "La contraseña debe tener al menos 8 caracteres" })
    @MaxLength(100, { message: "La contraseña no puede exceder los 100 caracteres" })
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'La contraseña debe tener al menos una mayúscula, una minúscula y un número'
    })
    @Field( () => String )
    password: string;

    @IsString({ message: "La contraseña de confirmación debe ser válido" })
    @MinLength(8, { message: "La contraseña de confirmación debe tener al menos 8 caracteres" })
    @MaxLength(100, { message: "La contraseña de confirmación no puede exceder los 100 caracteres" })
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'La contraseña de confirmación debe tener al menos una mayúscula, una minúscula y un número'
    })
    @Field( () => String )
    passwordConfirm: string;

    @IsIn(['M', 'F', 'O'], { message: "El tipo sexo debe ser válido" })
    @Field( () => String )
    gender: string;

    @IsString()
    @IsOptional()
    @Field( () => String, { nullable: true })
    img: string;

    @IsString()
    @IsOptional()
    @Field( () => String, { nullable: true })
    phone1: string;

    @IsString()
    @IsOptional()
    @Field( () => String, { nullable: true })
    phone2: string;

    @IsString()
    @IsOptional()
    @Field( () => Boolean, { nullable: true })
    isBlock: boolean;

}
