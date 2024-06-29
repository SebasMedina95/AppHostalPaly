import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../../config/prisma/prisma.service";

import { IResponseChargeRooms } from "./interfaces/charge-rooms.interface";
import { CustomError } from "../../../helpers/errors/custom.error";

import { User } from "../../../modules/users/entities/user.entity";


@Injectable()
export class UploadsService {

    private readonly logger = new Logger('UploadsService');

    constructor(
        private prisma: PrismaService
    ){}

    async uploadImagesRooms(
        id: number, 
        urlImages: string[], 
        user: User
    ): Promise<boolean | CustomError> {

        //Agregamos por cada URL registrada:
        let band: boolean = true;
        for (const iter of urlImages) {
            
            try {

                await this.prisma.tBL_DTL_IMAGES_CATEGORIES.create({
                    data: {
                        url: iter,
                        categoryId: id,
                        userCreateAt: user.email,
                        createDateAt: new Date()
                    }
                })

            } catch (error) {
                band = false;
            }

        }

        return band;

    }

    async uploadImageUser(
        id: number, 
        urlImage: string
    ): Promise<boolean | CustomError>{

        let band: boolean = true;

        try {

            await this.prisma.tBL_USERS.update({
                where: { id },
                data: {
                    img: urlImage
                }
            })
            
        } catch (error) {
            band = false;
        }

        return band;

    }

    async uploadImagePlan(
        id: number, 
        urlImage: string
    ): Promise<boolean | CustomError>{

        let band: boolean = true;

        try {

            await this.prisma.tBL_PLANS.update({
                where: { id },
                data: {
                    urlImage
                }
            })
            
        } catch (error) {
            band = false;
        }

        return band;

    }

}