import {WishListItemDto} from "../../WishListService/Dtos/WishListItemDto.ts";
import {ProductsMainPagedResponse} from "../Responses/ProductsMainPagedResponse.ts";

export interface ProductsMainPagedResponseUiExtended extends ProductsMainPagedResponse {
    wishList: WishListItemDto[];
}