import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Comfort {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
