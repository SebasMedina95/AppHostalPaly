import { ObjectType,
         Field,
         Int,
         ID } from '@nestjs/graphql';

@ObjectType()
export class Category {

  @Field( () => ID, { description: "Id autoincrementado para la PK" })
  id: number;

  @Field( () => String, { description: "Nombre de la categoría" })
  name: string;

  @Field( () => String, { description: "Descripción de la categoría" })
  description: string;

  @Field( () => String, { description: "Temática de la categoría" })
  theme: string;

  @Field( () => Boolean, { description: "Estado de la categoría" })
  status: boolean;
  
  @Field( () => Int, { description: "Cantidad de Reservaciones - Popularidad" })
  populate: number;

  @Field( () => String, { description: "Email del usuario que registra" })
  userCreateAt: string;

  @Field( () => Date, { description: "Fecha de Registro" })
  createDateAt: Date;

  @Field( () => String, { description: "Email del usuario que actualiza" })
  userUpdateAt: string;

  @Field( () => Date, { description: "Fecha de Actuaización" })
  updateDateAt: Date;

}
