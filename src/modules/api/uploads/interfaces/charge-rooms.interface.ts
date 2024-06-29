import { Plan } from "../../../../modules/plans/entities/plan.entity";
import { User } from "../../../../modules/users/entities/user.entity";
import { Category } from "../../../../modules/categories/entities/category.entity";

import { CategoryResponseWithComforts } from "../../../../modules/categories/types/create-update-response.type";
import { IErrorImages,
         IImages } from "./images.interfaces";

export interface IResponseChargeRooms {
    information: string;
    category: Category | CategoryResponseWithComforts | null;
    errors: IErrorImages[] | string;
    images: IImages[] | string[] | null;
}

export interface IResponseChargeImageUser {
    information: string;
    user: User | null;
    image: IImages | string | null;
}

export interface IResponseChargeImagePlan {
    information: string;
    plan: Plan | null;
    image: IImages | string | null;
}
