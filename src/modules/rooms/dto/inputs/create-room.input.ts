import { InputType,
         Int,
         Field } from '@nestjs/graphql';
import { IsDate,
         IsNotEmpty,
         IsNumber,
         IsOptional,
         IsString,
         MaxLength,
         MinLength } from 'class-validator';

@InputType()
export class CreateRoomInput {

  @IsNumber({}, { message: "El id de la categoría debe ser válido" })
  @IsNotEmpty({ message: "El id de la categoría es obligatoria" })
  @Field( () => Int )
  categoryId: number;

  @IsString({ message: "El nombre de la habitación debe ser válido" })
  @MinLength(3, { message: "El nombre de la habitación debe tener al menos 3 caracteres" })
  @MaxLength(25, { message: "El nombre de la habitación no puede exceder los 25 caracteres" })
  @IsNotEmpty({ message: "El nombre de la habitación es obligatoria" })
  @Field( () => String )
  name: string;

  @Field( () => Boolean, { nullable: true })
  maintenance: boolean;

  @IsOptional()
  @Field( () => String, { nullable: true })
  description: string;

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
