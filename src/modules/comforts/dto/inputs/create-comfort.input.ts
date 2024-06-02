import { InputType, Field } from '@nestjs/graphql';
import {
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

@InputType()
export class CreateComfortInput {

  @IsString({ message: 'El nombre de la comodidad debe ser válido' })
  @MinLength(5, { message: 'El nombre de la comodidad debe tener al menos 5 caracteres', })
  @MaxLength(150, { message: 'El nombre de la comodidad no puede exceder los 150 caracteres', })
  @IsNotEmpty({ message: 'El nombre de la comodidad es obligatoria' })
  @Field(() => String)
  name: string;

  @IsString({ message: 'La descripción de la comodidad debe ser válido' })
  @MinLength(5, { message: 'La descripción de la comodidad debe tener al menos 5 caracteres', })
  @MaxLength(5000, { message: 'La descripción de la comodidad no puede exceder los 150 caracteres', })
  @IsNotEmpty({ message: 'La descripción de la comodidad es obligatoria' })
  @Field(() => String)
  description: string;

  @IsOptional()
  @Field(() => Boolean, { nullable: true })
  status: boolean;

  @IsString()
  @MinLength(6)
  @IsOptional()
  @Field(() => String, { nullable: true })
  userDocumentCreateAt: string;

  @IsDate()
  @IsOptional()
  @Field(() => Date, { nullable: true })
  createDateAt: Date;

  @IsString()
  @MinLength(6)
  @IsOptional()
  @Field(() => String, { nullable: true })
  userDocumentUpdateAt: string;

  @IsDate()
  @IsOptional()
  @Field(() => Date, { nullable: true })
  updateDateAt: Date;
}
