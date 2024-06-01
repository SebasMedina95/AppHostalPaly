import { IsArray } from "class-validator";
import { PageMetaInput } from "./page-meta.input";
import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class PageInput<T> {
  
  @IsArray()
  readonly data: T[];

  readonly meta: PageMetaInput;

  constructor(data: T[], meta: PageMetaInput) {
    this.data = data;
    this.meta = meta;
  }
}