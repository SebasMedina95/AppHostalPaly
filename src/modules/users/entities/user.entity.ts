import { ObjectType,
         Field,
         Int,
         ID } from '@nestjs/graphql';

@ObjectType()
export class User {
  
  @Field( () => ID, { description: "Id autoincrementado para la PK" })
  id: number;

  @Field( () => String, { description: "Nombres del usuario" })
  names: string;

  @Field( () => String, { description: "Apellidos del usuario" })
  lastnames: string;

  @Field( () => String, { description: "Email del usuario" })
  email: string;

  @Field( () => Boolean, { description: "Email validado del usuario", defaultValue: false })
  emailValidated: boolean;

  // @Field( () => String, { description: "Password del usuario" }) NO SERÁ SELECCIONABLE
  password: string;
  
  @Field( () => [String], { description: "Roles del usuario", defaultValue: ["USER"] })
  roles: string[];

  @Field( () => String, { description: "Sexo del usuario" })
  gender: string;

  @Field( () => String, { description: "Avatar del usuario", nullable: true, defaultValue: "default.png" })
  img: string;

  @Field( () => String, { description: "Teléfono 1 del usuario", nullable: true })
  phone1: string;

  @Field( () => String, { description: "Teléfono 2 del usuario", nullable: true })
  phone2: string;

  @Field( () => Boolean, { description: "Estado del usuario" })
  isBlock: boolean;

}
