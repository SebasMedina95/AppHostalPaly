import { Field, InputType } from "@nestjs/graphql";
import { IsEmail,
         IsNotEmpty,
         IsString,
         Matches,
         MaxLength,
         MinLength } from "class-validator";

@InputType()
export class LoginInput {

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

}
