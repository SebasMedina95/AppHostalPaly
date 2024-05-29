import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Category {

  @Field( () => Int, { description: "Id autoincrementado para la PK" })
  id: number;

  @Field( () => String, { description: "Nombre de la categoría" })
  name: string;

  @Field( () => String, { description: "Descripción de la categoría" })
  description: string;

  @Field( () => String, { description: "Temática de la categoría" })
  theme: string;

  @Field( () => Boolean, { description: "Estado de la categoría" })
  status: boolean;

  @Field( () => String, { description: "Documento del usuario que registra" })
  userDocumentCreateAt: string;

  @Field( () => Date, { description: "Fecha de Registro" })
  createDateAt: Date;

  @Field( () => String, { description: "Documento del usuario que actualiza" })
  userDocumentUpdateAt: string;

  @Field( () => Date, { description: "Fecha de Actuaización" })
  updateDateAt: Date;

}
