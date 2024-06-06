import { ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

export class JwtAuthGuard extends AuthGuard('jwt') {

    //! *******************************************************************
    //! Override - Sobre escribir el que ya viene en AuthGuard
    //!            tenemos que hacer el re ajuste para el tema de GraphQL
    //! *******************************************************************
    getRequest( context: ExecutionContext ) {

        const ctx = GqlExecutionContext.create( context );
        const request = ctx.getContext().req;
        return request;

    }

}