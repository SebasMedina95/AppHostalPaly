import { Injectable, Logger } from "@nestjs/common";
import * as bcrypt from 'bcrypt';
import { PrismaService } from "../../../config/prisma/prisma.service";


@Injectable()
export class EmailVerifyService {

    private readonly logger = new Logger('EmailVerifyService');

    constructor(
        private prisma: PrismaService
    ){}

    async validateEmail(id: number): Promise<boolean> {

        const getUser = await this.prisma.tBL_USERS.findFirst({
            where: { id }
        });

        if( !getUser ) {
            this.logger.error("El usuario no fue encontrado para la verificación");
            return false;
        }

        const updateStatusUser = await this.prisma.tBL_USERS.update({
            where: { id },
            data: { emailValidated: true }
        })

        if( updateStatusUser ){
            return true;
        }else{
            this.logger.error("Ocurrió un error al intentar actualizar el email de verificación");
        }

    }

    async changeRecoveryPassword(recovery: string): Promise<boolean> {

        const getData: string[] = recovery.split('-');
        const userId: number = Number(getData[1]);
        const newPassword: string = getData[0];

        const getUser = await this.prisma.tBL_USERS.findFirst({
            where: {
                AND: [
                    { id: userId },
                    { passwordRecovery: newPassword }
                ]
            }
        });

        if( !getUser ) {
            this.logger.error("El usuario no fue encontrado para la recuperación o el password fue adulterado");
            return false;
        }

        //Si llegamos acá entonces actualizamos la contraseña
        //bcrypt.hashSync( signupInput.password, 10 ),
        const updatePassword = await this.prisma.tBL_USERS.update({
            where: { id: userId },
            data: {
                password: bcrypt.hashSync( newPassword, 10 ),
                passwordRecovery: null
            }
        });

        if( !updatePassword ){
            this.logger.error("El usuario no pudo ser actualizado");
            return false;
        }

        return true;

    }

}
