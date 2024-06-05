import { Controller, Get, Param } from "@nestjs/common";
import { AuthService } from "../auth.service";
import { EmailVerifyService } from "./email-verify.service";



@Controller('email')
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