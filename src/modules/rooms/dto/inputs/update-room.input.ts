import { IsNotEmpty, IsNumber } from 'class-validator';
import { CreateRoomInput } from './create-room.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateRoomInput extends PartialType(CreateRoomInput) {

  @IsNotEmpty({ message: "El id para la edición es requerid" })
  @IsNumber({}, { message: "El id debe ser un campo numérico" })
  @Field(() => Int)
  id: number;

}
