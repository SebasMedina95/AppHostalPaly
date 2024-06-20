import { Resolver,
         Query,
         Mutation,
         Args  } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { AuthService } from './auth.service';
import { User } from '../users/entities/user.entity';

import { UpdateAuthInput } from './dto/inputs/update-auth.input';
import { SignupInput } from './dto/inputs/signup.input';
import { LoginInput } from './dto/inputs/login.input';
import { UpdatePasswordInput } from './dto/inputs/update-password.input';

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

  @Mutation( () => AuthResponse, { name: 'signup', description: 'Registrarse en el sistema' } )
  async signup(
    @Args('signupInput') signupInput: SignupInput
  ): Promise<AuthResponse | CustomError> {

    return this.authService.signup(signupInput);

  }

  @Mutation( () => User, { name: 'updateUserFromLogin', description: 'Actualizar información básica del usuario' } )
  @UseGuards( JwtAuthGuard ) //? El JwtAuthGuard es mi Guard personalizado para GraphQL
  async updateFieldsSimple(
    @Args('updateAuthInput') updateAuthInput: UpdateAuthInput,
    @CurrentUser([ ValidRoles.USER, ValidRoles.ADMIN ]) user: User
  ): Promise<User | CustomError> {

    return this.authService.updateFieldsSimple(updateAuthInput, user);

  }

  @Mutation(() => User, { name: 'updateUserPasswordFromLogin', description: 'Actualizar la contraseña' })
  @UseGuards( JwtAuthGuard ) //? El JwtAuthGuard es mi Guard personalizado para GraphQL
  async updatePassword(
    @Args('updatePasswordInput') updatePasswordInput: UpdatePasswordInput,
    @CurrentUser([ ValidRoles.USER, ValidRoles.ADMIN ]) user: User
  ): Promise<User | CustomError> {

    return this.authService.updatePassword(updatePasswordInput, user);

  }

  //******************************TODO ******************************
  @Mutation(() => User, { name: 'recoveryPasswordFromLogin' })
  async recoveryPassword(
    @Args('emailRecovery') emailRecovery: string,
  ): Promise<User | CustomError>{
    
    return this.authService.recoveryPassword(emailRecovery);
    
  }


  @Mutation( () => AuthResponse, { name: 'login', description: 'Acceder al sistema' } )
  async login(
    @Args('loginInput') loginInput: LoginInput
  ): Promise<AuthResponse | CustomError> {

    return this.authService.login(loginInput);

  }

  @Query( () => AuthResponse, { name: "revalidate", description: "Revalidar el Token" } )
  @UseGuards( JwtAuthGuard ) //? El JwtAuthGuard es mi Guard personalizado para GraphQL
  async revalidateToken(
    @CurrentUser([ ValidRoles.ADMIN ]) user: User
  ): Promise<AuthResponse | CustomError> {

    return this.authService.revalidateToken(user);

  }

}
