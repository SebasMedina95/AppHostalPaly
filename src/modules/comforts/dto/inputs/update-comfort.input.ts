import { IsNotEmpty,
         IsNumber } from 'class-validator';
import { CreateComfortInput } from './create-comfort.input';
import { InputType,
         Field,
         Int,
         PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateComfortInput extends PartialType(CreateComfortInput) {
  
  @IsNotEmpty({ message: "El id para la edición es requerid" })
  @IsNumber({}, { message: "El id debe ser un campo numérico" })
  @Field(() => Int)
  id: number;
  
}
