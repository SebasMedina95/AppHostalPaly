import { Injectable, Logger } from "@nestjs/common";
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

}
