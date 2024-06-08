import { ObjectType,
        Field,
        Int,
        ID } from '@nestjs/graphql';

@ObjectType()
export class ComfortsForCategory {

    @Field( () => ID, { description: "Id autoincrementado para la PK" })
    id: number;

    @Field( () => Int, { description: "Id de la categoría" })
    categoryId: number;

    @Field( () => Int, { description: "Id de la comodidad" })
    comfortId: number;

    @Field( () => String, { description: "Email del usuario que registra" })
    userCreateAt: string;

    @Field( () => Date, { description: "Fecha de Registro" })
    createDateAt: Date;

}
