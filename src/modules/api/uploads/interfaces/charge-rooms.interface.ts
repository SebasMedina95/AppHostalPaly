import { User } from "src/modules/users/entities/user.entity";
import { Category } from "../../../../modules/categories/entities/category.entity";
import { CategoryResponseWithComforts } from "../../../../modules/categories/types/create-update-response.type";
import { IErrorImages, IImages } from "./images.interfaces";

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
