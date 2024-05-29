import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateComfortInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
