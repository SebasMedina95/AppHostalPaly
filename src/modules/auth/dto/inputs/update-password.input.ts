import { Field,
         InputType,
         Int } from "@nestjs/graphql";
import { IsNotEmpty,
         IsNumber,
         IsString,
         Matches,
         MaxLength,
         MinLength } from "class-validator";

@InputType()
export class UpdatePasswordInput {

    @IsNotEmpty({ message: "El id para la edición es requerid" })
    @IsNumber({}, { message: "El id debe ser un campo numérico" })
    @Field(() => Int)
    id: number;

    @IsString({ message: "La contraseña actual debe ser válido" })
    @MinLength(8, { message: "La contraseña actual debe tener al menos 8 caracteres" })
    @MaxLength(100, { message: "La contraseña actual no puede exceder los 100 caracteres" })
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'La contraseña actual debe tener al menos una mayúscula, una minúscula y un número'
    })
    @Field( () => String )
    currentPassword: string;

    @IsString({ message: "La nueva contraseña debe ser válido" })
    @MinLength(8, { message: "La nueva contraseña debe tener al menos 8 caracteres" })
    @MaxLength(100, { message: "La nueva contraseña no puede exceder los 100 caracteres" })
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'La nueva contraseña debe tener al menos una mayúscula, una minúscula y un número'
    })
    @Field( () => String )
    newPassword: string;

    @IsString({ message: "La confirmación de la nueva contraseña de confirmación debe ser válido" })
    @MinLength(8, { message: "La confirmación de la nueva contraseña de confirmación debe tener al menos 8 caracteres" })
    @MaxLength(100, { message: "La confirmación de la nueva contraseña de confirmación no puede exceder los 100 caracteres" })
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'La confirmación de la nueva contraseña de confirmación debe tener al menos una mayúscula, una minúscula y un número'
    })
    @Field( () => String )
    confirmPassword: string;

}