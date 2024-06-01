import { Field, Int, ObjectType } from '@nestjs/graphql';
import { PageMetaInputParameters } from '../interfaces/page-meta-parameters.interface';

@ObjectType()
export class PageMetaInput {
    
  @Field(() => Int)
  readonly page: number;

  @Field(() => Int)
  readonly take: number;

  @Field(() => Int)
  readonly itemCount: number;

  @Field(() => Int)
  readonly pageCount: number;

  @Field(() => Boolean)
  readonly hasPreviousPage: boolean;

  @Field(() => Boolean)
  readonly hasNextPage: boolean;

  constructor({ pageOptionsArgs, itemCount }: PageMetaInputParameters) {
    this.page = pageOptionsArgs.page;
    this.take = pageOptionsArgs.take;
    this.itemCount = itemCount;
    this.pageCount = Math.ceil(this.itemCount / this.take);
    this.hasPreviousPage = this.page > 1;
    this.hasNextPage = this.page < this.pageCount;
  }
}
