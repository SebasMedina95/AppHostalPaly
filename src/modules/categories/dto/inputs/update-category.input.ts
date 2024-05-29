import { IsNotEmpty,
         IsNumber } from 'class-validator';
import { CreateCategoryInput } from './create-category.input';
import { InputType,
         Field,
         Int,
         PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateCategoryInput extends PartialType(CreateCategoryInput) {

  @IsNotEmpty({ message: "El id para la edición es requerid" })
  @IsNumber({}, { message: "El id debe ser un campo numérico" })
  @Field(() => Int)
  id: number;

}
