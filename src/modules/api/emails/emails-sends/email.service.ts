import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as nodemailer from 'nodemailer';

import { SendMailOptions } from "../../../auth/interfaces/email.interfaces";
import { User } from "../../../users/entities/user.entity";
import { SignupInput } from "../../../auth/dto/inputs/signup.input";


@Injectable()
export class EmailService {

    private readonly logger = new Logger('EmailService');
    private transporter: nodemailer.Transporter;

    constructor(
        private configService: ConfigService
    ){

        const mailerService: string = this.configService.get<string>('MAILER_SERVICE');
        const mailerEmail: string = this.configService.get<string>('MAILER_EMAIL');
        const mailerSecretKey: string = this.configService.get<string>('MAILER_SECRET_KEY');

        this.transporter = nodemailer.createTransport({
            service: mailerService,
            auth: {
                user: mailerEmail,
                pass: mailerSecretKey,
            }
        });

        // console.log({mailerService});
        // console.log({mailerEmail});
        // console.log({mailerSecretKey});

    }

    async sendEmail( options: SendMailOptions ): Promise<boolean> {

        const { to, subject, htmlBody, attachements = [] } = options;

        try {

            if( !this.configService.get<boolean>('SEND_EMAIL') ) return true;

            await this.transporter.sendMail({
                to: to,
                subject: subject,
                html: htmlBody,
                attachments: attachements,
            });

            return true;

        } catch ( error ) {

            return false;

        }

    }

    async sendEmailValidationUser(
        user: User, 
        signup: SignupInput
    ): Promise<boolean> {

        const { id, email, names, lastnames } = user;
        const { password } = signup;
        const link = `${ this.configService.get<string>('WEB_SERVICE_URL') }/email/verify-email/${ id }`;
        
        const html = `

            <!DOCTYPE html>
            <html lang="es">
                <head>
                    <meta charset="UTF-8">
                    <title>Verificación de Correo Electrónico</title>
                </head>
                <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
                    <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse;">
                        <tr>
                            <td align="center" bgcolor="#ffffff" style="padding: 40px 0;">
                                <img src="https://cdn.icon-icons.com/icons2/171/PNG/512/email_blue_23344.png" alt="Email Icon" width="80" style="display: block;"/>
                            </td>
                        </tr>
                        <tr>
                            <td bgcolor="#ffffff" style="padding: 20px;">
                                <h1 style="color: #333333; margin-top: 0;">Verificación de Correo Electrónico</h1>
                                <p style="color: #666666;">
                                    Cordial saludo ${names} ${lastnames}. 
                                    Para completar el proceso de verificación y poder gestionar su usuario para Hostal Paly, 
                                    por favor haz clic en el botón de abajo.
                                </p>
                                <a href="${ link }" 
                                style="background-color: #007bff; color: #ffffff; padding: 10px 20px; text-decoration: none; 
                                border-radius: 4px; display: inline-block;">
                                    Verificar Correo Electrónico
                                </a>
                                <p style="color: #666666; margin-top: 20px;">Si no puedes hacer clic en el botón, copia y pega la siguiente URL en tu navegador:</p>
                                <p style="color: #007bff; margin-top: 10px;"><a href="${ link }" style="color: #007bff; text-decoration: underline;">${ link }</a></p>
                            </td>
                        </tr>
                        <tr>
                            <td bgcolor="#ffffff" style="padding: 20px;">
                                <h1 style="color: #333333; margin-top: 0;">Credenciales Dispuestas:</h1>
                                <p style="color: #666666;">
                                    Su usuario/email para ingresar al sistema es:
                                    <h3 style="color: #1DDB34; margin-top: 0;"> ${ email } </h3>
                                </p>
                                <p style="color: #666666;">
                                    Su contraseña para ingresar al sistema es:
                                    <h3 style="color: #1DDB34; margin-top: 0;"> ${ password } </h3>
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td bgcolor="#f4f4f4" style="padding: 20px; text-align: center;">
                                <p style="color: #666666; margin: 0;">
                                    Este correo electrónico fue enviado desde la aplicación de Hostal Paly (API RESTful - NestJS + GraphQL).
                                    Confirmación del correo electrónico: ${ email }
                                    <b>Si se trata de un error por favor ignore este correo</b>
                                </p>

                            </td>
                        </tr>
                    </table>
                </body>
            </html>

        `;

        const options = {
            to: email,
            subject: "Validación de Email",
            htmlBody: html
        }

        const isSent = await this.sendEmail( options );
        if( !isSent ) return false;

        return true;

    }

}