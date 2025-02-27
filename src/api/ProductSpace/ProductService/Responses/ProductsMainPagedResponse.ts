import {ShortProductDto} from "../Dtos/ShortProductDto.ts";
import {BaseResponse} from "../../../BaseResponse.ts";
import {RecommendedGroupDto} from "../Dtos/RecommendedGroupDto.ts";

export interface ProductsMainPagedResponse extends BaseResponse {
    products: ShortProductDto[];
    hasMoreProducts: boolean;
    recommendedGroupsDto : RecommendedGroupDto[];
    hasMoreRecommendedGroups: boolean;
    page: number;
}

