import { CreateComfortInput } from './create-comfort.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateComfortInput extends PartialType(CreateComfortInput) {
  @Field(() => Int)
  id: number;
}
