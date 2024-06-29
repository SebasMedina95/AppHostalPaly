import { IsNotEmpty,
         IsNumber } from 'class-validator';
import { InputType,
         Field,
         Int,
         PartialType } from '@nestjs/graphql';
import { CreatePlanInput } from './create-plan.input';

@InputType()
export class UpdatePlanInput extends PartialType(CreatePlanInput) {
  
  @IsNotEmpty({ message: "El id para la edición es requerid" })
  @IsNumber({}, { message: "El id debe ser un campo numérico" })
  @Field(() => Int)
  id: number;
  
}
