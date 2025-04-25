import {CategoryDto} from "../Dtos/CategoryDto.ts";
import {PathSegment} from "../../../../store/header/categoriesSlice.ts";

export interface CategoryDtoUiExtended extends CategoryDto{
    pathSegments: PathSegment[];
    subCategories: CategoryDtoUiExtended[]
}