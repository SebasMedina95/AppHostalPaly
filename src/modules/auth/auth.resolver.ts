import { Resolver,
         Query,
         Mutation,
         Args  } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { AuthService } from './auth.service';

import { Auth } from './entities/auth.entity';
import { User } from '../users/entities/user.entity';

import { CreateAuthInput } from './dto/inputs/create-auth.input';
import { UpdateAuthInput } from './dto/inputs/update-auth.input';
import { SignupInput } from './dto/inputs/signup.input';
import { LoginInput } from './dto/inputs/login.input';

import { AuthResponse } from './types/auth-response.type';

import { CustomError } from '../../helpers/errors/custom.error';
import { ValidRoles } from '../../constants/roles.enum';

import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';

@Resolver(() => AuthResponse)
export class AuthResolver {

  constructor(
    private readonly authService: AuthService
  ) {}

  @Mutation( () => AuthResponse, { name: 'signup' } )
  async signup(
    @Args('signupInput') signupInput: SignupInput
  ): Promise<AuthResponse | CustomError> {

    return this.authService.signup(signupInput);

  }

  // @Mutation()
  // update(): Promise<any> {

  //   // return this.authService.create();
  //   return null;

  // }

  @Mutation( () => AuthResponse, { name: 'login' } )
  async login(
    @Args('loginInput') loginInput: LoginInput
  ): Promise<AuthResponse | CustomError> {

    return this.authService.login(loginInput);

  }

  // @Mutation()
  // recoveryPassword(): Promise<any> {

  //   // return this.authService.recoveryPassword();
  //   return null;

  // }

  @Query( () => AuthResponse, { name: "revalidate" } )
  @UseGuards( JwtAuthGuard ) //? El JwtAuthGuard es mi Guard personalizado para GraphQL
  async revalidateToken(
    @CurrentUser([
      ValidRoles.ADMIN
    ]) user: User
  ): Promise<AuthResponse | CustomError> {

    return this.authService.revalidateToken(user);

  }

}