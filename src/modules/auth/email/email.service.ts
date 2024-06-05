import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as nodemailer from 'nodemailer';
import { SendMailOptions } from "../interfaces/email.interfaces";


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

        console.log({mailerService});
        console.log({mailerEmail});
        console.log({mailerSecretKey});

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
         //* Variables pendientes *//
    ): Promise<boolean> {

        //TODO
        console.log("Enviando el email ...");
        return true;

    }

}