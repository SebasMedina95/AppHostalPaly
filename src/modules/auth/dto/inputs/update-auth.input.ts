import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { SignupInput } from './signup.input';
import { IsIn,
         IsNotEmpty,
         IsNumber,
         IsString,
         MaxLength,
         MinLength } from 'class-validator';

@InputType()
// export class UpdateAuthInput extends PartialType(SignupInput) {
export class UpdateAuthInput {

  @IsNotEmpty({ message: "El id para la edición es requerid" })
  @IsNumber({}, { message: "El id debe ser un campo numérico" })
  @Field(() => Int)
  id: number;

  @IsString({ message: "Los nombres del usuario deben ser válido" })
  @MinLength(3, { message: "Los nombres del usuario deben tener al menos 3 caracteres" })
  @MaxLength(150, { message: "Los nombres del usuario no pueden exceder los 150 caracteres" })
  @IsNotEmpty({ message: "Los nombres del usuario son obligatorios" })
  @Field( () => String, { nullable: true } )
  names?: string;

  @IsString({ message: "Los apellidos del usuario deben ser válido" })
  @MinLength(3, { message: "Los apellidos del usuario deben tener al menos 3 caracteres" })
  @MaxLength(150, { message: "Los apellidos del usuario no pueden exceder los 150 caracteres" })
  @IsNotEmpty({ message: "Los apellidos del usuario son obligatorios" })
  @Field( () => String, { nullable: true } )
  lastnames?: string;

  @IsIn(['M', 'F', 'O'], { message: "El tipo sexo debe ser válido" })
  @Field( () => String, { nullable: true } )
  gender?: string;

  @IsString()
  @Field( () => String, { nullable: true })
  phone1?: string;

  @IsString()
  @Field( () => String, { nullable: true })
  phone2?: string;

}
