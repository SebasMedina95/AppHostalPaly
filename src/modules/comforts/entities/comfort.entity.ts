import { ObjectType,
         Field,
         ID } from '@nestjs/graphql';

@ObjectType()
export class Comfort {

  @Field( () => ID, { description: "Id autoincrementado para la PK" })
  id: number;

  @Field( () => String, { description: "Nombre de la comodidad" })
  name: string;

  @Field( () => String, { description: "Descripción de la comodidad" })
  description: string;

  @Field( () => Boolean, { description: "Estado de la comodidad" })
  status: boolean;

  @Field( () => String, { description: "Email del usuario que registra" })
  userCreateAt: string;

  @Field( () => Date, { description: "Fecha de Registro" })
  createDateAt: Date;

  @Field( () => String, { description: "Email del usuario que actualiza" })
  userUpdateAt: string;

  @Field( () => Date, { description: "Fecha de Actuaización" })
  updateDateAt: Date;

}
