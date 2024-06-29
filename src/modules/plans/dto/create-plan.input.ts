import { InputType, Int, Field } from '@nestjs/graphql';
import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, MaxLength, MinLength } from 'class-validator';

@InputType()
export class CreatePlanInput {

  @IsString({ message: "El nombre del plan debe ser válido" })
  @MinLength(5, { message: "El nombre del plan debe tener al menos 5 caracteres" })
  @MaxLength(40, { message: "El nombre del plan no puede exceder los 40 caracteres" })
  @IsNotEmpty({ message: "El nombre del plan es obligatoria" })
  @Field( () => String )
  type: string;

  @IsOptional()
  urlImage?: string;

  @IsString({ message: "La descripción del plan debe ser válido" })
  @MinLength(5, { message: "La descripción del plan debe tener al menos 5 caracteres" })
  @MaxLength(1000, { message: "La descripción del plan no puede exceder los 1000 caracteres" })
  @IsNotEmpty({ message: "La descripción del plan es obligatoria" })
  @Field( () => String )
  description: string;

  @IsNumber({}, { message: "El valor de la temporada alta debe ser numérico" })
  @IsPositive({ message: "El valor de la temporada alta del plan debe ser positivo" })
  @IsNotEmpty({ message: "El valor de la temporada alta es requerido" })
  @Field( () => Number )
  highSeasonPrice: number;

  @IsNumber({}, { message: "El valor de la temporada baja debe ser numérico" })
  @IsPositive({ message: "El valor de la temporada baja del plan debe ser positivo" })
  @IsNotEmpty({ message: "El valor de la temporada baja es requerido" })
  @Field( () => Number )
  LowSeasonPrice: number;

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
