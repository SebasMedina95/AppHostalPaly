import { Injectable,
         Logger,
         UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { UpdateAuthInput } from './dto/inputs/update-auth.input';
import { SignupInput } from './dto/inputs/signup.input';
import { LoginInput } from './dto/inputs/login.input';
import { UpdatePasswordInput } from './dto/inputs/update-password.input';

import { AuthResponse } from './types/auth-response.type';
import { CustomError } from '../../helpers/errors/custom.error';

import { UsersService } from '../users/users.service';
import { PrismaService } from '../../config/prisma/prisma.service';
import { EmailService } from '../api/emails/emails-sends/email.service';

import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {

  constructor(
      private usersService: UsersService,
      private readonly emailService: EmailService,
      private prisma: PrismaService,
      private readonly jwtService: JwtService,
  ){}

  async signup(signupInput: SignupInput): Promise<AuthResponse | CustomError> {

    const logger = new Logger('AuthService - signup')

    try {

      //* Paso 1. Creo el usuario
      const user = await this.usersService.create(signupInput);

      if( user instanceof CustomError )
        return CustomError.badRequestError("Ocurrió algún error en el registro de usuario y no podemos proseguir");

      //* Paso 2. Envío el Email de confirmación
      const sendEmail: boolean = await this.emailService.sendEmailValidationUser(user, signupInput);
      
      if( !sendEmail )
        return CustomError.badRequestError("Ocurrió algún error al enviar el email");

      //* Paso 3. Genero token (Podría ser opcional, tendrá más sentido en el Login)
      const token: string = this.getJwtToken( user.id );


      return {
        user,
        token,
      }
      
    } catch (error) {

      logger.log(`Ocurrió un error al intentar crear el usuario: ${error}`);
      throw CustomError.internalServerError(`${error}`);
      
    }

  }

  async updateFieldsSimple(updateAuthInput: UpdateAuthInput, user: User): Promise<User | CustomError> {

    const logger = new Logger('AuthService - update');
    const currentUser: User = user;

    try {

      const user: User | CustomError = await this.usersService.updateFieldsSimple(currentUser, updateAuthInput);
      return user;
      
    } catch (error) {
      
      logger.log(`Ocurrió un error al intentar actualizar el usuario: ${error}`);
      throw CustomError.internalServerError(`${error}`);

    }

  }

  async validateUser( id: number ): Promise<User> {

    const user = await this.usersService.findOneById( id );
    const getUser = user as User;

    if( !getUser.emailValidated )
        throw new UnauthorizedException(`El usuario no ha validado su email, si se trata de un error hable con el ADMIN.`);

    if( getUser.isBlock )
        throw new UnauthorizedException(`El usuario se encuentra bloqueado, si se trata de un error hable con el ADMIN.`);

    delete getUser.password; //No es necesario devolver esto por seguridad
    return getUser;

  }

  async login(loginInput: LoginInput): Promise<AuthResponse | CustomError> {

    const logger = new Logger('AuthService - login');
    const { email, password } = loginInput;

    try {

      //* Paso 1. Verificamos el email
      const getUserByEmail: User | CustomError = await this.usersService.findOneByEmail( email );

      if( !getUserByEmail || getUserByEmail == null || getUserByEmail == undefined )
        return CustomError.badRequestError("No fue encontrado el email proporcionado");

      //* Paso 2. Verificamos que el email se haya validado
      const convertUserResponse: User = getUserByEmail as User; //Forzamos porque en este punto ya lo tenemos
      if( !convertUserResponse.emailValidated )
        return CustomError.badRequestError("El usuario no ha confirmado su email");

      //* Paso 3. Validamos la contraseña
      if( !bcrypt.compareSync( password, convertUserResponse.password ) )
        return CustomError.badRequestError("La contraseña no coincide");

      //* Paso 4. Validamos que el usuario no este bloqueado
      if( convertUserResponse.isBlock )
        return CustomError.badRequestError("El usuario esta bloqueado, contacte con el admin");

      //* Paso 5. Generamos el JWT.
      const token: string = this.getJwtToken( convertUserResponse.id );

      return {
        user: getUserByEmail,
        token
      }
      
    } catch (error) {

      logger.log(`Ocurrió un error al intentar logear el usuario: ${error}`);
      throw CustomError.internalServerError(`${error}`);
      
    } finally {
      
      logger.log(`Operación de Login Finalizada`);
      await this.prisma.$disconnect();

    }
  }

  async revalidateToken( user: User ): Promise<AuthResponse | CustomError> {
    
    const logger = new Logger('AuthService - revalidateToken');

    try {

      const getUserById: User | CustomError = await this.usersService.findOneById( user.id );

      if( !getUserById || getUserById == null || getUserById == undefined )
        return CustomError.badRequestError("No fue encontrado el id proporcionado");

      const token: string = this.getJwtToken( user.id );

      return {
        user: getUserById,
        token
      }
      
    } catch (error) {

      logger.log(`Ocurrió un error al intentar revalidar el token de usuario: ${error}`);
      throw CustomError.internalServerError(`${error}`);
      
    } finally {
      
      logger.log(`Operación de Revalidación de Token Finalizada`);
      await this.prisma.$disconnect();

    }

  }

  async updatePassword( updatePasswordInput: UpdatePasswordInput, user: User ): Promise<User | CustomError> {

    const logger = new Logger('AuthService - updatePassword');
    const currentUser: User = user;

    try {

      const user: User | CustomError = await this.usersService.updatePassword(updatePasswordInput, currentUser);
      return user;
      
    } catch (error) {
      
      logger.log(`Ocurrió un error al intentar actualizar el password del usuario: ${error}`);
      throw CustomError.internalServerError(`${error}`);

    }

  }

  async recoveryPassword(emailRecovery: string): Promise<User | CustomError> {

    const logger = new Logger('AuthService - recoveryPassword');

    try {

      //1. Verificar que el email exista
      const search: string = emailRecovery.toLowerCase().trim();
      const getEmail = await this.usersService.findOneByEmail(search)

      if( !getEmail || getEmail instanceof CustomError )
        return CustomError.badRequestError("No pudo ser enviado el email, esto puede deberse a que el email no se encuentra registrado");

      //2. Genero un password aleatorio
      const getRandomPass: string = this.generateRandomString(20);

      //3. Actualizo el password de recuperación en la tabla
      const updateUserPassRecovery = await this.prisma.tBL_USERS.update({
        where: { id: getEmail.id },
        data: {
          passwordRecovery: getRandomPass
        }
      });

      if( !updateUserPassRecovery )
        return CustomError.badRequestError("No se pudo actualizar la contraseña de recuperación en la tabla");

      //4. Envío del email
      const sendEmail: boolean = await this.emailService.sendEmailRecoveryPassword(getEmail, getRandomPass);
      
      if( !sendEmail )
        return CustomError.badRequestError("Ocurrió algún error al enviar el email");

      return getEmail;
      
    } catch (error) {

      logger.log(`Ocurrió un error al intentar enviar el email de recuperación: ${error}`);
      throw CustomError.internalServerError(`${error}`);
      
    }

  }

  private getJwtToken( userId: number ): string {

    return this.jwtService.sign({ id: userId });

  }

  private generateRandomString(length: number): string {

    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
  
    return result;

  }

  
}
