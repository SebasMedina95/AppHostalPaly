import { ObjectType,
         Field,
         Int } from '@nestjs/graphql';

@ObjectType()
export class Plan {

  @Field(() => Int, { description: 'Id del Plan' })
  id: number

  @Field( () => String, { description: "Tipo de Plan" })
  type: string;

  @Field( () => String, { description: "Url imagen del Plan", nullable: true })
  urlImage?: string;

  @Field( () => String, { description: "Descripción del Plan" })
  description: string;

  @Field( () => Number, { description: "Precio Plan en Temporada Alta" })
  highSeasonPrice: number;

  @Field( () => Number, { description: "Precio Plan en Temporada Baja" })
  LowSeasonPrice: number;

  @Field( () => Boolean, { description: "Estado del Plan" })
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
