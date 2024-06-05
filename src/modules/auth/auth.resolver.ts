import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { Auth } from './entities/auth.entity';
import { CreateAuthInput } from './dto/inputs/create-auth.input';
import { UpdateAuthInput } from './dto/inputs/update-auth.input';
import { SignupInput } from './dto/inputs/signup.input';
import { AuthResponse } from './types/auth-response.type';
import { CustomError } from '../../helpers/errors/custom.error';
import { LoginInput } from './dto/inputs/login.input';

@Resolver(() => Auth)
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

  // @Query()
  // revalidateToken(): Promise<any> {

  //   // return this.authService.revalidateToken();
  //   return null;

  // }

  

}
