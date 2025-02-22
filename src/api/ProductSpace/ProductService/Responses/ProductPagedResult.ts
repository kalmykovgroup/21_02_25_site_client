import {ShortProductDto} from "../Dtos/ShortProductDto.ts";

export interface ProductPagedResult {
    items: ShortProductDto[];
    hasMore: boolean;
    page: number;
}


