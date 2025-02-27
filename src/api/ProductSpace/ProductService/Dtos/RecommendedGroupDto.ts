
import {ShortProductDto} from "./ShortProductDto.ts";

export interface RecommendedGroupDto{
    id: string;
    title: string;
    background?: string;
    color: string;
    products: ShortProductDto[];
}
