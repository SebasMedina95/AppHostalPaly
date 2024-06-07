import { InputType,
         Int,
         Field } from '@nestjs/graphql';
import { IsDate,
         IsIn,
         IsNotEmpty,
         IsNumber,
         IsOptional,
         IsString,
         MaxLength,
         MinLength } from 'class-validator';

@InputType()
export class CreateCategoryInput {

  @IsString({ message: "El nombre de la categoría debe ser válido" })
  @MinLength(5, { message: "El nombre de la categoría debe tener al menos 5 caracteres" })
  @MaxLength(150, { message: "El nombre de la categoría no puede exceder los 150 caracteres" })
  @IsNotEmpty({ message: "El nombre de la categoría es obligatoria" })
  @Field( () => String )
  name: string;

  @IsString({ message: "La descripción de la categoría debe ser válido" })
  @MinLength(5, { message: "La descripción de la categoría debe tener al menos 5 caracteres" })
  @MaxLength(5000, { message: "La descripción de la categoría no puede exceder los 150 caracteres" })
  @IsNotEmpty({ message: "La descripción de la categoría es obligatoria" })
  @Field( () => String )
  description: string;

  @IsIn([
    "Presidencial",
    "Romantica",
    "Caribe",
    "Suite",
    "Familiar",
    "Estandar",
    "Hospedaje",
  ], { message: "La temática debe ser una opción válida" })
  @IsNotEmpty({ message: "El tema de la categoría es obligatoria" })
  @Field( () => String )
  theme: string;

  @IsOptional()
  @Field( () => Boolean, { nullable: true } )
  status: boolean;
  
  @IsOptional()
  @IsNumber({}, { message: "La popularidad es un campo numérico" })  
  @Field( () => Int, { nullable: true } )
  populate: number;

  @IsString()
  @MinLength(6)
  @IsOptional()
  @Field( () => String, { nullable: true } )
  userCreateAt: string;

  @IsDate()
  @IsOptional()
  @Field( () => Date, { nullable: true } )
  createDateAt: Date;

  @IsString()
  @MinLength(6)
  @IsOptional()
  @Field( () => String, { nullable: true } )
  userUpdateAt: string;

  @IsDate()
  @IsOptional()
  @Field( () => Date, { nullable: true } )
  updateDateAt: Date;

}
