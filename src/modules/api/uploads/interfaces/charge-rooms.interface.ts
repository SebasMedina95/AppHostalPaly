import { Category } from "../../../../modules/categories/entities/category.entity";
import { CategoryResponseWithComforts } from "../../../../modules/categories/types/create-update-response.type";
import { IErrorImages, IImages } from "./images.interfaces";

export interface IResponseChargeRooms {
    information: string;
    category: Category | CategoryResponseWithComforts | null;
    errors: IErrorImages[] | string;
    images: IImages[] | string[] | null;
}
