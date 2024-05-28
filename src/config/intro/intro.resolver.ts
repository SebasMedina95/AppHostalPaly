import { Args, Float, Int, Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class IntroResolver {

    @Query( () => String, { description: "Método inicial para las configuraciones GraphQL" })
    hello(): string {
       return "Saludos!, App Hostal Paly" 
    }

    @Query( () => Float, { description: "Generación de número aleatorio" })
    randomNumber(): number {
        const randomVal: number = Number((Math.random() * 100).toFixed(2));
        return randomVal;
    }

    @Query( () => [Int], { description: "Retornar el arreglo de valores pares a partir de un número dado" })
    generateArrayPairs( 
        @Args('value', { type: () => Int, nullable: true }) value: number  = 30
    ): number[] {

        let arrayResponse: number[] = [];
        for (let i = 0; i <= value; i++) {
            if( i % 2 == 0 ){
                arrayResponse.push(i)
            }
        }

        return arrayResponse;
    }

}
