import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { AuthService } from "../../auth/auth.service";
import { EmailVerifyService } from "./email-verify.service";
import { JwtAuthGuard } from "src/modules/auth/guards/jwt-auth.guard";



@Controller('email')
@UseGuards( JwtAuthGuard ) //? El JwtAuthGuard es mi Guard personalizado para GraphQL
export class EmailVerifyController {

    constructor(
        private readonly emailServiceVerify: EmailVerifyService,
    ) {}

    @Get('verify-email/:id')
    async validateEmail(
        @Param('id') id: number
    ): Promise<boolean> {

        return this.emailServiceVerify.validateEmail(id);

    }

}