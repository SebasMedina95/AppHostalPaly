import { createParamDecorator,
         ExecutionContext,
         ForbiddenException,
         InternalServerErrorException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

import { ValidRoles } from '../../../constants/roles.enum';
import { User } from '../../users/entities/user.entity';

export const CurrentUser = createParamDecorator( 
( roles: ValidRoles[] = [], context: ExecutionContext ) => {

   const ctx = GqlExecutionContext.create( context )
   const user: User = ctx.getContext().req.user;
   const getUser = user as User;

   if ( !user ) 
       throw new InternalServerErrorException(`No se encontró el Usuario en la Request - Error con el AuthGuard`);

   if ( roles.length === 0 ) 
       throw new InternalServerErrorException(`No se asignaron roles a la Request - Error con el AuthGuard`);
   
   for ( const role of user.roles ) {

       if ( roles.includes( role as ValidRoles ) ) {
           return user;
       }

   }

   throw new ForbiddenException(
       `El usuario ${ getUser.email } necesita permisos de [${ roles }]`
   )

})