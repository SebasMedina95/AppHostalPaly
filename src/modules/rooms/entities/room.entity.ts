import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Category } from 'src/modules/categories/entities/category.entity';

@ObjectType()
export class Room {

  @Field(() => ID, { description: "Id autoincrementado para la PK" })
  id: number;

  @Field( () => Int, { description: "Id de la categoría" })
  categoryId: number;

  @Field( () => String, { description: "Nombre de la habitación" })
  name: string;

  @Field( () => Boolean, { description: "Se encuentra en mantenimiento" })
  maintenance: boolean;

  @Field( () => String, { nullable: true, description: "Descripciones de la habitación" })
  description: string;

  @Field( () => Boolean, { description: "Estado de la habitación" })
  status: boolean;

  @Field( () => String, { description: "Email del usuario que registra" })
  userCreateAt: string;

  @Field( () => Date, { description: "Fecha de Registro" })
  createDateAt: Date;

  @Field( () => String, { description: "Email del usuario que actualiza" })
  userUpdateAt: string;

  @Field( () => Date, { description: "Fecha de Actuaización" })
  updateDateAt: Date;

  @Field( () => Category, {nullable: true})
  category?: Category

}
